<script lang="ts">
    import Base from "client/component/Base.svelte";
    import SvgPencil from "client/svg/Pencil.svelte";
    import SvgPlus from "client/svg/Plus.svelte";
    import SvgSearch from "client/svg/Search.svelte";
    import SvgTrashCan from "client/svg/TrashCan.svelte";
    import { writable } from "svelte/store";
    import { EditMode } from "client/util/EditMode";
    import Cookies from "js-cookie";
    import { onMount } from "svelte";
    import dateFormat from "dateformat";

    let transactions = [];
    let filteredTransaction = [];
    let filter = "";

    onMount(() => {
        fetch("/transaction/all", {
            headers: { Authorization: Cookies.get("token") },
        }).then(async (res) => {
            transactions = await res.json();
            filteredTransaction = transactions;
        });
    });

    let showOverlay = false;
    let editMode = EditMode.CREATE;

    const editor: any = writable({
        id: 0,
        itemId: 0,
        customerId: 0,
        date: new Date(),
        qty: 0,
        totalPrice: "",
        discount: "",
        priceAfterDiscount: "",
    });

    function formatDate(date): string {
        return dateFormat(date, "dd-mm-yyyy HH:MM");
    }

    function formatPrice(price: number): string {
        return ("" + price).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    }

    function updateFilter() {
        filteredTransaction = transactions.filter(
            (v) => filter === "" || v.name.toLowerCase().includes(filter.toLowerCase())
        );
    }

    function clear() {
        editor.id = -1;
        editor.itemId = 0;
        editor.customerId = 0;
        editor.date = new Date();
        editor.qty = 0;
        editor.totalPrice = "";
        editor.discount = "";
        editor.priceAfterDiscount = "";
    }

    function set(transaction) {
        editor.id = transaction.id;
        editor.itemId = transaction.itemId;
        editor.customerId = transaction.customerId;
        editor.date = new Date(transaction.date);
        editor.qty = transaction.qty;
        editor.totalPrice = transaction.totalPrice;
        editor.discount = transaction.discount;
        editor.priceAfterDiscount = transaction.priceAfterDiscount;
    }

    function create() {
        clear();

        editMode = EditMode.CREATE;
        showOverlay = true;
    }

    function edit(transaction) {
        set(transaction);

        editMode = EditMode.EDIT;
        showOverlay = true;
    }

    function del(transaction) {
        set(transaction);

        editMode = EditMode.DELETE;
        showOverlay = true;
    }

    function submit() {
        switch (editMode) {
            case EditMode.CREATE:
                fetch("/transaction/create", {
                    method: "POST",
                    headers: {
                        Authorization: Cookies.get("token"),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editor),
                }).then(async (res) => {
                    const transaction = await res.json();
                    transactions = [...transactions, transaction];
                });
                break;
            case EditMode.EDIT:
                fetch("/transaction/edit", {
                    method: "POST",
                    headers: {
                        Authorization: Cookies.get("token"),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editor),
                }).then((res) => {
                    const transaction = transactions.find((v) => v.id == editor.id);
                    transaction.code = editor.code;
                    transaction.name = editor.name;
                    transaction.address = editor.address;

                    transactions = transactions;
                });
                break;
            case EditMode.DELETE:
                fetch("/transactions/delete", {
                    method: "DELETE",
                    headers: {
                        Authorization: Cookies.get("token"),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editor),
                }).then((res) => {
                    transactions = transactions.filter((v) => v.id != editor.id);
                });
                break;
        }

        showOverlay = false;
    }

    function cancel() {
        showOverlay = false;
    }
</script>

<Base pageName="Transaction">
    <div class="flex flex-col w-full">
        <!-- sticky header -->
        <div class="sticky top-0 pt-3 px-3 border-b-2 bg-gray-800 border-gray-900 text-gray-200">
            <div class="flex w-full space-x-2">
                <!-- searchbar -->
                <div class="relative text-gray-600 focus-within:text-gray-400">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                        <SvgSearch />
                    </span>
                    <input
                        name="q"
                        class="py-3 text-sm w-64 text-white bg-gray-900 rounded-md pl-10 focus:outline-none focus:bg-gray-200 focus:text-gray-900"
                        bind:value={filter}
                        on:input={updateFilter}
                        placeholder="Search..." />
                </div>
                <div class="flex-grow" />

                <!-- add button -->
                <button
                    class="w-30 p-2 rounded-lg w-12 grid place-items-center focus:outline-none transition-colors hover:bg-green-600 hover:text-gray-200"
                    on:click={create}><SvgPlus /></button>
            </div>

            <!-- table header -->
            <div class="flex w-full mt-1 font-bold text-center">
                <div class="w-40">Date</div>
                <div class="w-64">Item</div>
                <div class="flex-grow">Customer</div>
                <div class="w-20">Qty</div>
                <div class="w-64">Total Price</div>
                <div class="w-20">Controls</div>
            </div>
        </div>

        <!-- table -->
        <table class="table-fixed mx-3 mt-3 border-collapse">
            <tbody>
                {#each filteredTransaction as transaction, index}
                    <tr class="bg-gray-{index % 2 ? 400 : 300}">
                        <td class="p-2 w-40 border-r-2 border-gray-200 text-center font-mono"
                            >{formatDate(new Date(transaction.date))}</td>
                        <td class="p-2 w-64 border-r-2 border-gray-200">{transaction.itemName}</td>
                        <td class="p-2 w-auto border-r-2 border-gray-200">{transaction.customerName}</td>
                        <td class="p-2 w-20 border-r-2 border-gray-200">{transaction.qty}</td>
                        <td class="p-2 w-64 border-r-2 border-gray-200 text-right">
                            <div class="flex">
                                Rp
                                <div class="flex-grow font-mono">{formatPrice(transaction.priceAfterDiscount)}</div>
                            </div>
                        </td>
                        <td class="p-2 w-20">
                            <div class="flex">
                                <!-- edit button -->
                                <button
                                    class="rounded-lg flex-grow grid place-items-center focus:outline-none transition-colors hover:text-blue-600"
                                    on:click={() => edit(transaction)}><SvgPencil /></button>

                                <!-- delete button -->
                                <button
                                    class="rounded-lg flex-grow grid place-items-center focus:outline-none transition-colors hover:text-red-600"
                                    on:click={() => del(transaction)}><SvgTrashCan /></button>
                            </div>
                        </td>
                    </tr>
                {/each}

                <!-- footer -->
                <tr class="bg-gray-{filteredTransaction.length % 2 ? 400 : 300}">
                    <td class="p-2 w-40 border-r-2 border-gray-200 text-center font-mono">
                        <div class="flex">
                            <button
                                class="rounded-lg flex-grow grid place-items-center focus:outline-none transition-colors hover:text-green-700"
                                on:click={create}><SvgPlus /></button>
                        </div>
                    </td>
                    <td class="p-2 w-64 border-r-2 border-gray-200">
                        <div class="flex">
                            <button
                                class="rounded-lg flex-grow grid place-items-center focus:outline-none transition-colors hover:text-green-700"
                                on:click={create}><SvgPlus /></button>
                        </div></td>
                    <td class="p-2 w-auto border-r-2 border-gray-200 text-right font-mono">
                        <div class="flex">
                            <button
                                class="rounded-lg flex-grow grid place-items-center focus:outline-none transition-colors hover:text-green-700"
                                on:click={create}><SvgPlus /></button>
                        </div>
                    </td>
                    <td class="p-2 w-20 border-r-2 border-gray-200"
                        ><div class="flex">
                            <button
                                class="rounded-lg flex-grow grid place-items-center focus:outline-none transition-colors hover:text-green-700"
                                on:click={create}><SvgPlus /></button>
                        </div></td>
                    <td class="p-2 w-64 border-r-2 border-gray-200"
                        ><div class="flex">
                            <button
                                class="rounded-lg flex-grow grid place-items-center focus:outline-none transition-colors hover:text-green-700"
                                on:click={create}><SvgPlus /></button>
                        </div>
                    </td>
                    <td class="p-2 w-20">
                        <div class="flex">
                            <button
                                class="rounded-lg flex-grow grid place-items-center focus:outline-none transition-colors hover:text-green-700"
                                on:click={create}><SvgPlus /></button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- crud overlay -->
    <div
        class="fixed inset-0 w-full h-full bg-black bg-opacity-75 flex flex-auto items-center justify-center fade-{showOverlay
            ? 'in'
            : 'out'}"
        class:invisible={!showOverlay}>
        <form class="w-96 p-10 bg-gray-300 rounded-lg flex flex-col">
            <div class="text-center text-xl font-bold">{editMode}</div>
            {#if editMode == EditMode.DELETE}
                <!-- delete confirmation -->
                <div class="text-base text-gray-800 text-center my-2">Delete "{formatDate(editor.date)}"?</div>
                <div class="flex justify-center space-x-2">
                    <button
                        class="bg-red-500 w-20 hover:bg-red-600 rounded-lg text-gray-50 py-2 px-4 font-bold focus:outline-none"
                        type="button"
                        on:click={submit}>
                        Delete
                    </button>
                    <button
                        class="bg-green-500 w-20 hover:bg-green-600 rounded-lg text-gray-50 py-2 px-4 font-bold focus:outline-none"
                        type="button"
                        on:click={cancel}>
                        Cancel
                    </button>
                </div>
            {:else}
                <!-- create/edit form -->
                <div class="text-xs pl-4 text-gray-800">Code</div>
                <input
                    class="bg-white border-2 mb-2 block w-full py-2 px-4 rounded-lg focus:outline-none focus:border-gray-900"
                    placeholder="Code"
                    bind:value={editor.code} />
                <div class="text-xs pl-4 text-gray-800">Name</div>
                <input
                    class="bg-white border-2 mb-2 block w-full py-2 px-4 rounded-lg focus:outline-none focus:border-gray-900"
                    placeholder="Name"
                    bind:value={editor.name} />
                <div class="text-xs pl-4 text-gray-800">Address</div>
                <input
                    class="bg-white border-2 mb-2 block w-full py-2 px-4 rounded-lg focus:outline-none focus:border-gray-900"
                    placeholder="Address"
                    bind:value={editor.address} />
                <div class="flex justify-end space-x-2">
                    <button
                        class="bg-green-500 w-20 ml-2 hover:bg-green-600 float-right rounded-lg text-gray-50 py-2 px-4 font-bold focus:outline-none"
                        type="button"
                        on:click={submit}>
                        Save
                    </button>
                    <button
                        class="bg-red-500 w-20 hover:bg-red-600 float-right rounded-lg text-gray-50 py-2 px-4 font-bold focus:outline-none"
                        type="button"
                        on:click={cancel}>
                        Cancel
                    </button>
                </div>
            {/if}
        </form>
    </div>
</Base>

<style>
    .fade-in {
        visibility: visible;
        opacity: 1;
        transition: opacity 200ms ease-in-out;
    }

    .fade-out {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s 200ms ease-in-out, opacity 200ms ease-in-out;
    }
</style>
