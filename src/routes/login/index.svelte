<script lang="ts">
    import { writable } from "svelte/store";
    import { goto } from "@sapper/app";
    import md5 from "md5";
    import {
        Container,
        Form,
        FormGroup,
        Input,
        Label,
        Button,
        Toast,
        ToastHeader,
    } from "sveltestrap";

    const user: any = writable({
        username: "",
        password: "",
    });

    const invalid = {
        username: false,
        password: false,
    };

    let failedToast = false;

    function submit() {
        const { username, password } = user;
        invalid.username = username === "";
        invalid.password = password === "";

        if (invalid.username || invalid.password) {
            return;
        }

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.trim(),
                password: md5(password),
            }),
        }).then((res) => {
            if (res.ok) {
                goto("/dashboard");
            } else {
                failedToast = true;
            }
        });
    }
</script>

<Container class="w-25 h-auto align-middle my-auto">
    <h3 class="text-center">Login</h3>
    <Form>
        <FormGroup>
            <Label for="username">Username</Label>
            <Input
                type="text"
                id="username"
                placeholder="Username"
                bind:invalid={invalid.username}
                bind:value={user.username}
            />
        </FormGroup>
        <FormGroup>
            <Label for="password">Password</Label>
            <Input
                type="password"
                id="password"
                placeholder="Password"
                bind:invalid={invalid.password}
                bind:value={user.password}
            />
        </FormGroup>
        <Button class="float-right" type="button" on:click={submit}
            >Login</Button
        >
    </Form>

    {#if failedToast}
        <div class="bg-danger">
            <Toast class="mr-1" danger>
                <ToastHeader>Failed</ToastHeader>
            </Toast>
        </div>
    {/if}
</Container>
