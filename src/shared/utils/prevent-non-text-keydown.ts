export const preventNonTextKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter']

    if (/^\d$/.test(e.key)) {
        return
    }

    if (allowedKeys.includes(e.key)) {
        return
    }

    if (e.ctrlKey || e.metaKey) {
        return
    }

    e.preventDefault()
}