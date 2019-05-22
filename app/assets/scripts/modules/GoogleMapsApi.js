/**
 * Use this class to ensure Google Maps API javascript is loaded before running any google map specific code.
 */
export default class GoogleMapsApi {
  /**
   * Constructor set up config.
   */
  constructor() {
    // api key for google maps
    this.apiKey = "AIzaSyD1QvoySzCNvNj3Dffh0uMJfGMLf-NtOME";

    // set a globally scoped callback if it doesn't already exist
    if (!window._GoogleMapsApi) {
      this.callbackName = "_GoogleMapsApi.mapLoaded";
      window._GoogleMapsApi = this;
      window._GoogleMapsApi.mapLoaded = this.mapLoaded.bind(this);
    }
  }

  /**
   * Load the Google Maps API javascript
   */
  load() {
    if (typeof window.google === "undefined") {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        this.apiKey
      }&callback=${this.callbackName}`;
      script.async = true;
      document.head.append(script);
    }
  }

  /**
   * Globally scoped callback for the map loaded
   */
  mapLoaded() {}
}
