# Project Title
**Home Assistant Custom Components**
>
    A collection of custom integrations for Home Assistant.

## Configuration
### Cards
- Create config/www/ (public static folder).
- Upload my-custom.js there.
- Add a resources: entry (/local/my-custom.js).
- Reference the script in a Lovelace card (type: custom:…) or a custom panel.
- Refresh the UI, test in the browser console.

That’s it! Once the script is loaded as a Lovelace resource, you can use any exported component or function just like a built-in Home Assistant feature.


## License
This project is licensed under the MIT License.