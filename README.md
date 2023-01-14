# smart-fuel-oil-logger
Logs structured information about your home's heating oil usage from smartoilgauge.com to third-party logging services like Datadog

# Usage

```
export SMART_FUEL_OIL_COOKIE="ga=...; _fbp=...; PHPSESSID=...; ccf_app_remember_me=...; _gid=...; _gat=1"
export DATADOG_API_KEY=da39a3ee5e6b4b0d3255bfef95601890afd80709
node index.js
```

# smartfueloil.com cookie
Visit https://app.smartoilgauge.com/, open Chrome Inspector's Network tab, reload the page, and find the `cookie` header sent in the request for `ajax/main_ajax.php`.

## Datadog API key
Your Datadog API key can be generated via the website ([docs](https://docs.datadoghq.com/account_management/api-app-keys/))