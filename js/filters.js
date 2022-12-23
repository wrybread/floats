var filters = (function() {

   return {
      /*
       * Douglas Peucker line simplification routine
       * http://www.bdcc.co.uk/Gmaps/GDouglasPeuker.js
       */
      GDPeuker: function(data) {

        var gdp = GDouglasPeucker(_.pluck(data, "googLatLng"), 2),
            result = _.filter(data, function(c) {
            return _.contains(gdp, c.googLatLng);
          });

        return result;
      }
   }

})();
