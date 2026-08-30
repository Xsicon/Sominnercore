window.chatScroll = {
    nearBottomThreshold: 80,

    isNearBottom: function (container) {
        if (!container) return true;
        var threshold = window.chatScroll.nearBottomThreshold;
        return container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
    },

    scrollToBottom: function (container, anchorOrForce, force) {
        if (!container) return;

        var anchor = null;
        var shouldForce = force === true;

        if (typeof anchorOrForce === 'boolean') {
            shouldForce = anchorOrForce;
        } else if (anchorOrForce) {
            anchor = anchorOrForce;
        }

        if (!shouldForce && !window.chatScroll.isNearBottom(container)) {
            return;
        }

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                container.scrollTop = container.scrollHeight;
                if (anchor && typeof anchor.scrollIntoView === 'function') {
                    anchor.scrollIntoView({ block: 'end', behavior: 'auto' });
                }
            });
        });
    }
};
