<svelte:head>
    <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootswatch/4.5.2/darkly/bootstrap.min.css"
    />
</svelte:head>

<main>
    <slot />
</main>

<style>
    main {
        position: relative;
        margin: 0 auto;
        box-sizing: border-box;
        min-height: 100%;
    }
</style>
