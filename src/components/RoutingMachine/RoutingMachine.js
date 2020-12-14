import { 
    MapLayer, 
    withLeaflet } from 'react-leaflet';
import 'leaflet-routing-machine';
import L from 'leaflet';

class Routing extends MapLayer {

    // override
    createLeafletElement() {
        const { map, pointOne, pointTwo } = this.props;
        let leafletElement = L.Routing.control({
            waypoints: [pointOne, pointTwo],
            collapsible: true,
            position: 'bottomleft',
            routeWhileDragging: true,
            reverseWaypoints: true,
            showAlternatives: true,
            altLineOptions: {
                styles: [
                    {color: 'black', opacity: 0.15, weight: 9},
                    {color: 'white', opacity: 0.8, weight: 6},
                    {color: 'blue', opacity: 0.5, weight: 2}
                ]
            },
        }).addTo(map.leafletElement);
        return leafletElement.getPlan();
    }
}

export default withLeaflet(Routing);