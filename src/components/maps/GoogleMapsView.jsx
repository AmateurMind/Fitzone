import React, { useEffect, useRef } from 'react';
import { View, Platform } from 'react-native';

const GoogleMapsView = ({ gyms = [], centerLat = 18.5679, centerLng = 73.9144, apiKey, onMarkerPress }) => {
    const mapContainerId = useRef(`google-map-${Date.now()}`);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const scriptLoadedRef = useRef(false);
    const activeInfoWindowRef = useRef(null);

    useEffect(() => {
        if (Platform.OS !== 'web' || !apiKey) return;

        const initializeMap = () => {
            const container = document.getElementById(mapContainerId.current);
            if (!container || !window.google) {
                console.log('Map container or Google Maps not ready');
                return;
            }

            try {
                // Create map - zoomed in for Viman Nagar area only
                const map = new window.google.maps.Map(container, {
                    center: { lat: centerLat, lng: centerLng },
                    zoom: 14, // Higher zoom = closer view (14 is good for neighborhood level)
                    styles: [
                        { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
                        { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
                        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] }
                    ]
                });

                mapInstanceRef.current = map;

                // Clear existing markers
                markersRef.current.forEach(marker => marker.setMap(null));
                markersRef.current = [];

                // Filter gyms with coordinates
                const gymsWithCoords = gyms.filter(g => g.latitude && g.longitude);
                console.log('Gyms with coordinates:', gymsWithCoords.length);

                if (!activeInfoWindowRef.current) {
                    activeInfoWindowRef.current = new window.google.maps.InfoWindow();
                }

                // Add markers
                gymsWithCoords.forEach((gym, index) => {
                    const marker = new window.google.maps.Marker({
                        position: { lat: gym.latitude, lng: gym.longitude },
                        map: map,
                        title: gym.name,
                        label: {
                            text: `${index + 1}`,
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        },
                        icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: gym.tier === 'Elite' ? '#FBBF24' : '#14B8A6',
                            fillOpacity: 1,
                            strokeColor: 'white',
                            strokeWeight: 2
                        }
                    });

                    marker.addListener('click', () => {
                        if (activeInfoWindowRef.current) {
                            activeInfoWindowRef.current.setContent(`
                                <div style="color: #1e293b; font-family: system-ui; padding: 8px; min-width: 200px;">
                                    <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 16px; font-weight: bold;">${gym.name}</h3>
                                    <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px;">${gym.address || gym.area || ''}</p>
                                    <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px;">⭐ ${gym.rating || 'N/A'} • ${gym.tier || 'Pro'}</p>
                                    <p style="margin: 0; color: #14b8a6; font-size: 11px; font-weight: 600;">📍 ${gym.distance || ''}</p>
                                </div>
                            `);
                            activeInfoWindowRef.current.open(map, marker);
                        }
                        if (onMarkerPress) {
                            onMarkerPress(gym);
                        }
                    });

                    markersRef.current.push(marker);
                });

                // Fit bounds to show all markers
                if (markersRef.current.length > 0) {
                    const bounds = new window.google.maps.LatLngBounds();
                    markersRef.current.forEach(marker => {
                        bounds.extend(marker.getPosition());
                    });
                    map.fitBounds(bounds, { padding: 50 });
                } else {
                    // If no markers, just center on Viman Nagar
                    map.setCenter({ lat: centerLat, lng: centerLng });
                    map.setZoom(14);
                }
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        // Load Google Maps script
        if (!window.google && !scriptLoadedRef.current) {
            scriptLoadedRef.current = true;
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                setTimeout(initializeMap, 100);
            };
            script.onerror = () => {
                console.error('Failed to load Google Maps script. Make sure:');
                console.error('1. Maps JavaScript API is enabled in Google Cloud Console');
                console.error('2. API key has correct permissions');
                console.error('3. API key is not restricted or restrictions allow this domain');
            };
            document.head.appendChild(script);
        } else if (window.google) {
            setTimeout(initializeMap, 100);
        }

        return () => {
            markersRef.current.forEach(marker => marker.setMap(null));
        };
    }, [gyms, centerLat, centerLng, apiKey]);

    if (Platform.OS !== 'web') {
        return null;
    }

    return (
        <View style={{ width: '100%', height: 400, borderRadius: 12, overflow: 'hidden', backgroundColor: '#1e293b' }}>
            <div
                id={mapContainerId.current}
                style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '400px',
                    borderRadius: '12px'
                }}
            />
        </View>
    );
};

export default GoogleMapsView;
