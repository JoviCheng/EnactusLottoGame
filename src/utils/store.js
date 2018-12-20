export default {
    fetch(STORAGE_KET) {
        return JSON.parse(window.localStorage.getItem(STORAGE_KET) || '[]')
    },
    save(STORAGE_KET,items) {
        window.localStorage.setItem(STORAGE_KET, JSON.stringify(items))
    },
    clear() {
        window.localStorage.removeItem(STORAGE_KET)
    }
}