window.stickyNote = {
    attachDrag: function (panelId, handleSelector) {
        var panel = document.getElementById(panelId);
        if (!panel) return;

        var handle = panel.querySelector(handleSelector);
        if (!handle) return;

        var dragging = false;
        var offsetX = 0;
        var offsetY = 0;

        handle.addEventListener('mousedown', function (e) {
            if (e.target.closest('button')) return;
            dragging = true;
            var rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            handle.style.cursor = 'grabbing';
            e.preventDefault();
        });

        function onMove(e) {
            if (!dragging) return;
            var width = panel.offsetWidth || 360;
            var height = panel.offsetHeight || 320;
            var newX = Math.max(10, Math.min(window.innerWidth - width - 10, e.clientX - offsetX));
            var newY = Math.max(70, Math.min(window.innerHeight - height - 10, e.clientY - offsetY));
            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
        }

        function onUp() {
            if (!dragging) return;
            dragging = false;
            handle.style.cursor = 'grab';
        }

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    },

    getSavedColorHex: function () {
        try {
            return localStorage.getItem('kobneti_sticky_color') || '#F29D68';
        } catch (e) {
            return '#F29D68';
        }
    },

    saveColorHex: function (hex) {
        try {
            localStorage.setItem('kobneti_sticky_color', hex);
            window.dispatchEvent(new CustomEvent('kobneti:sticky-color-change', { detail: { hex: hex } }));
        } catch (e) {
            // ignore
        }
    }
};
