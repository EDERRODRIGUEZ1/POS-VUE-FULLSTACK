
<template>
    <div class="flex justify-between">
        <dt class="font-bold">
            <slot name="label" />
        </dt>

        <dd class="text-gray-900">
            <slot></slot>
        </dd>
    </div>
</template>