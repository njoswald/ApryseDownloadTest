const { documentViewer, annotationManager, Annotations } = instance.Core;
const { setHeaderItems, enableElements, disableElements, enableFeatures, disableFeatures, setTheme, Feature, Theme } = instance.UI;

instance.UI.addEventListener(instance.UI.Events.VIEWER_LOADED, () => {
    instance.UI.setTheme('dark');
    instance.UI.enableElements(['header','downloads']);
    instance.UI.enableFeatures([Feature.FilePicker]);
});