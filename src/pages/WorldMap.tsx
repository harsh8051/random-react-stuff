import { useEffect, useState } from "react"
import { geoNaturalEarth1, geoGraticule, geoPath, json } from 'd3'
import { feature, mesh } from 'topojson-client'


export default function WorldMap() {

    const jsonURL = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json'

    const [data, setData] = useState();

    console.log(data)

    useEffect(() => {

        json(jsonURL).then(topology => {
            const { countries,land } = topology.objects
            setData({
               countries: feature(topology, land),
               interiors: mesh(topology,countries,function(a,b){return a!==b})
            })
        })
    }, [])

    const projection = geoNaturalEarth1();
    const path = geoPath(projection)
    const gradicules= geoGraticule()

    if (!data) {
        return <h1>Loading...</h1>
    }

    return (
        <svg width={960} height={500}>
            <g style={
                {
                    fill: '#137B80'
                }
            }>
                <path style={
                    {
                        fill: '#DBDBDB',
                    }
                } d={path({ type: 'Sphere' })} />
                <path style={
                    {
                        fill: 'none',
                        stroke:'#ccc3c3'
                    }
                } d={path(gradicules())} />
                {
                    data.countries.features.map(feature => <path d={path(feature)} />)
                }
                <path style={
                    {
                        fill: 'none',
                        stroke:'#68d0e8'
                    }
                } d={path(data.interiors)} />
            </g>
        </svg>
    )
}
