<script context="module" lang="ts">
    export async function preload(page, session) {
        const res = await this.fetch("/menu/get_all");
        const menus = await res.json();
        return { menus };
    }
</script>

<script lang="ts">
    import Base from "client/components/Base.svelte";
    import SvgPencil from "client/svg/Pencil.svelte";
    import SvgPlus from "client/svg/Plus.svelte";
    import SvgSearch from "client/svg/Search.svelte";
    import SvgTrashCan from "client/svg/TrashCan.svelte";

    export let menus = [];

    let showOverlay = false;

    function edit(menu) {
        showOverlay = true;
    }

    function del(menu) {
        showOverlay = true;
    }
</script>

<Base pageName="Menu">
    <div class="flex flex-col w-full space-y-2">
        <!-- sticky header -->
        <div class="sticky top-0 pt-2 border-b-2 bg-gray-200 border-gray-900">
            <div class="flex w-full space-x-2">
                <!-- searchbar -->
                <button
                    class="w-80 p-2 rounded-lg focus:outline-none transition-colors border-2 border-green-500 hover:bg-green-500 hover:text-gray-200"
                    ><SvgSearch /></button>

                <!-- flex hack, like always -->
                <div class="flex-grow" />

                <!-- add button -->
                <button
                    class="w-30 p-2 rounded-lg w-12 grid justify-items-center focus:outline-none transition-colors border-2 border-green-600 bg-green-400 hover:bg-green-600 hover:text-gray-200"
                    ><SvgPlus /></button>
            </div>

            <!-- table header -->
            <div class="flex w-full mt-1 font-bold text-center">
                <div class="w-20 focus:outline-none">Code</div>
                <div class="flex-grow focus:outline-none">Name</div>
                <div class="w-1/5 focus:outline-none">Price</div>
                <div class="w-24 m-2" />
            </div>
        </div>

        <!-- cursed "table" like bruh lmao -->
        {#each menus as menu}
            <div class="flex w-full">
                <div
                    class="w-20 p-2 focus:outline-none transition-colors border-2 border-green-500 hover:bg-green-500 hover:text-gray-200">
                    {menu.code}
                </div>
                <div
                    class="flex-grow p-2 focus:outline-none text-left transition-colors border-2 border-l-0 border-green-500 hover:bg-green-500 hover:text-gray-200">
                    {menu.name}
                </div>
                <div
                    class="w-1/5 p-2 focus:outline-none text-right font-mono transition-colors border-2 border-l-0 border-green-500 hover:bg-green-500 hover:text-gray-200">
                    {menu.price}
                </div>

                <!-- edit button -->
                <button
                    class="p-2 rounded-lg w-12 grid justify-items-center mx-2 focus:outline-none transition-colors border-2 border-blue-600 bg-blue-400 hover:bg-blue-600 hover:text-gray-200"
                    on:click={() => edit(menu)}><SvgPencil /></button>

                <!-- delete button -->
                <button
                    class="p-2 rounded-lg w-12 grid justify-items-center focus:outline-none transition-colors border-2 border-red-600 bg-red-400 hover:bg-red-600 hover:text-gray-200"
                    on:click={() => del(menu)}><SvgTrashCan /></button>
            </div>
        {/each}
    </div>

    <div class="fixed inset-0 w-full h-full bg-black bg-opacity-75 flex flex-auto items-center justify-center" class:invisible={!showOverlay}>
        <form class="space-y-2 p-10 bg-gray-300 rounded-lg">
            <div class="text-center text-xl font-bold">Login</div>
            <input
                class="bg-white border-2 block w-full py-2 px-4 rounded-lg focus:outline-none focus:border-gray-700"
                placeholder="Username" />
            <input
                class="bg-white border-2 block w-full py-2 px-4 rounded-lg focus:outline-none focus:border-gray-700"
                type="password"
                placeholder="Password" />
            <button
                class="bg-gray-500 hover:bg-gray-600 float-right rounded-lg text-gray-50 py-2 px-4 font-bold focus:outline-none"
                type="button">
                Login
            </button>
        </form>
    </div>
</Base>
