if (typeof(SwissAddressMatcher) == "undefined") {
    SwissAddressMatcher = {};
}


SwissAddressMatcher.functions = {
    compositeField: "address1_composite",
	compositePrefix: "address1_composite_compositionLinkControl_",
    streetFieldName: "address1_line1",
    plzFieldName: "address1_postalcode",
    cityFieldName: "address1_city",

    RegisterOnChangeEvents: function() {
        Xrm.Page.getAttribute(SwissAddressMatcher.functions.streetFieldName).addOnChange(this.OpenSwissAddressMatcher);
    },

    OpenSwissAddressMatcher: function() {
        var street = Xrm.Page.getAttribute(SwissAddressMatcher.functions.streetFieldName).getValue();
        var plz = Xrm.Page.getAttribute(SwissAddressMatcher.functions.plzFieldName).getValue();
        var city = Xrm.Page.getAttribute(SwissAddressMatcher.functions.cityFieldName).getValue();
        var customParameters = encodeURIComponent("street=" + street + "&plz=" + plz + "&city=" + city);
        Xrm.Utility.openWebResource("new_/index.html", customParameters);
    },

    RegisterListener: function() {
        if (window.addEventListener) {
            window.addEventListener('message', this.UpdateAddressData, false);
        } else {
            // IE8 or earlier
            window.attachEvent('onmessage', this.UpdateAddressData);
        }
    },

    UpdateAddressData: function(event) {
        var origin = "";
        if (event.domain)
            origin = event.domain;
        // IE
        else if (event.origin)
            origin = event.origin;
        // FireFox - Chrome

        if (Xrm.Page.context.getClientUrl() == origin) {
            if (event.data != null) {
                var data = JSON.parse(event.data);
                if (data) {
                    var street = Xrm.Page.getAttribute(streetFieldName).setValue(data.street);
                    Xrm.Page.data.save();
                }
            } else {
                alert("This message has been posted by an unknown source ('" + origin + "', expected '" + Xrm.Page.context.getClientUrl() + "').");
                return;
            }
        }
    }
};