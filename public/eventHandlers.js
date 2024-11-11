export function addEventListeners(renderer, scenes, cameras) {
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        cameras.forEach(camera => {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    });
    window.addEventListener('mousedown', (event) => {
        // Handle mouse down events
    });
    window.addEventListener('mousemove', (event) => {
        // Handle mouse move events
    });
    window.addEventListener('mouseup', () => {
        // Handle mouse up events
    });
    window.addEventListener('keydown', (event) => {
        // Handle key down events
    });
}
//# sourceMappingURL=eventHandlers.js.map