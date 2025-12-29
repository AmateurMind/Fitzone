/**
 * Professional SVG Icon Component
 * High-quality vector icons using react-native-svg
 */

import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon } from 'react-native-svg';

// Icon definitions using SVG paths (Lucide-style icons)
const iconPaths = {
    // Navigation
    Home: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <Polyline points="9 22 9 12 15 12 15 22" />
        </Svg>
    ),
    ArrowLeft: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Line x1="19" y1="12" x2="5" y2="12" />
            <Polyline points="12 19 5 12 12 5" />
        </Svg>
    ),
    ArrowRight: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Line x1="5" y1="12" x2="19" y2="12" />
            <Polyline points="12 5 19 12 12 19" />
        </Svg>
    ),
    ChevronRight: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polyline points="9 18 15 12 9 6" />
        </Svg>
    ),
    ChevronLeft: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polyline points="15 18 9 12 15 6" />
        </Svg>
    ),

    // User & Profile
    User: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <Circle cx="12" cy="7" r="4" />
        </Svg>
    ),
    Users: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <Circle cx="9" cy="7" r="4" />
            <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </Svg>
    ),

    // Actions
    Play: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polygon points="5 3 19 12 5 21 5 3" />
        </Svg>
    ),
    Search: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="11" cy="11" r="8" />
            <Line x1="21" y1="21" x2="16.65" y2="16.65" />
        </Svg>
    ),
    Bell: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </Svg>
    ),
    Settings: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="3" />
            <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </Svg>
    ),
    Filter: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </Svg>
    ),
    Send: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Line x1="22" y1="2" x2="11" y2="13" />
            <Polygon points="22 2 15 22 11 13 2 9 22 2" />
        </Svg>
    ),
    Mic: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <Line x1="12" y1="19" x2="12" y2="23" />
            <Line x1="8" y1="23" x2="16" y2="23" />
        </Svg>
    ),
    Square: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        </Svg>
    ),
    Trash: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polyline points="3 6 5 6 21 6" />
            <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </Svg>
    ),
    X: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Line x1="18" y1="6" x2="6" y2="18" />
            <Line x1="6" y1="6" x2="18" y2="18" />
        </Svg>
    ),
    Plus: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Line x1="12" y1="5" x2="12" y2="19" />
            <Line x1="5" y1="12" x2="19" y2="12" />
        </Svg>
    ),
    Edit: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </Svg>
    ),

    // Time & Calendar
    Clock: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
            <Polyline points="12 6 12 12 16 14" />
        </Svg>
    ),
    Calendar: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <Line x1="16" y1="2" x2="16" y2="6" />
            <Line x1="8" y1="2" x2="8" y2="6" />
            <Line x1="3" y1="10" x2="21" y2="10" />
        </Svg>
    ),

    // Fitness
    Dumbbell: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M6.5 6.5a2.121 2.121 0 0 1 3 0l9 9a2.121 2.121 0 0 1-3 3l-9-9a2.121 2.121 0 0 1 0-3z" />
            <Path d="M2 12L12 2" />
            <Path d="M12 22L22 12" />
            <Path d="M2.8 13.2l1.5-1.5" />
            <Path d="M19.7 10.3l1.5-1.5" />
            <Path d="M13.2 2.8l-1.5 1.5" />
            <Path d="M10.3 19.7l-1.5 1.5" />
        </Svg>
    ),
    Zap: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </Svg>
    ),
    Activity: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </Svg>
    ),
    TrendingUp: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <Polyline points="17 6 23 6 23 12" />
        </Svg>
    ),
    Target: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
            <Circle cx="12" cy="12" r="6" />
            <Circle cx="12" cy="12" r="2" />
        </Svg>
    ),
    Heart: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </Svg>
    ),
    Flame: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </Svg>
    ),

    Volume2: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </Svg>
    ),
    Brain: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
            <Path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </Svg>
    ),
    Sparkles: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <Path d="M5 3v4" />
            <Path d="M9 3v4" />
            <Path d="M3 5h4" />
            <Path d="M3 9h4" />
        </Svg>
    ),
    // Status
    Crown: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
        </Svg>
    ),
    Star: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </Svg>
    ),
    Award: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="8" r="7" />
            <Polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </Svg>
    ),
    Check: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polyline points="20 6 9 17 4 12" />
        </Svg>
    ),
    CheckCircle: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <Polyline points="22 4 12 14.01 9 11.01" />
        </Svg>
    ),
    AlertCircle: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
            <Line x1="12" y1="8" x2="12" y2="12" />
            <Line x1="12" y1="16" x2="12.01" y2="16" />
        </Svg>
    ),
    Info: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
            <Line x1="12" y1="16" x2="12" y2="12" />
            <Line x1="12" y1="8" x2="12.01" y2="8" />
        </Svg>
    ),

    // Location
    MapPin: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <Circle cx="12" cy="10" r="3" />
        </Svg>
    ),
    Map: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <Line x1="8" y1="2" x2="8" y2="18" />
            <Line x1="16" y1="6" x2="16" y2="22" />
        </Svg>
    ),

    // Communication
    MessageCircle: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </Svg>
    ),
    Mail: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <Polyline points="22,6 12,13 2,6" />
        </Svg>
    ),
    Phone: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </Svg>
    ),

    // Misc
    Clipboard: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <Rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </Svg>
    ),
    List: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Line x1="8" y1="6" x2="21" y2="6" />
            <Line x1="8" y1="12" x2="21" y2="12" />
            <Line x1="8" y1="18" x2="21" y2="18" />
            <Line x1="3" y1="6" x2="3.01" y2="6" />
            <Line x1="3" y1="12" x2="3.01" y2="12" />
            <Line x1="3" y1="18" x2="3.01" y2="18" />
        </Svg>
    ),
    CreditCard: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <Line x1="1" y1="10" x2="23" y2="10" />
        </Svg>
    ),
    Gift: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Polyline points="20 12 20 22 4 22 4 12" />
            <Rect x="2" y="7" width="20" height="5" />
            <Line x1="12" y1="22" x2="12" y2="7" />
            <Path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <Path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </Svg>
    ),
    Camera: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <Circle cx="12" cy="13" r="4" />
        </Svg>
    ),
    QrCode: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Rect x="3" y="3" width="7" height="7" />
            <Rect x="14" y="3" width="7" height="7" />
            <Rect x="3" y="14" width="7" height="7" />
            <Rect x="14" y="14" width="3" height="3" />
            <Rect x="18" y="14" width="3" height="3" />
            <Rect x="14" y="18" width="3" height="3" />
            <Rect x="18" y="18" width="3" height="3" />
        </Svg>
    ),
    Loader: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Line x1="12" y1="2" x2="12" y2="6" />
            <Line x1="12" y1="18" x2="12" y2="22" />
            <Line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
            <Line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
            <Line x1="2" y1="12" x2="6" y2="12" />
            <Line x1="18" y1="12" x2="22" y2="12" />
            <Line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
            <Line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        </Svg>
    ),
    Share2: (color, size, strokeWidth) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="18" cy="5" r="3" />
            <Circle cx="6" cy="12" r="3" />
            <Circle cx="18" cy="19" r="3" />
            <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </Svg>
    ),
};

/**
 * Professional Icon component using SVG
 */
const Icon = ({ name, size = 24, color = '#FFFFFF', strokeWidth = 2, style }) => {
    const iconRenderer = iconPaths[name];
    
    if (!iconRenderer) {
        // Fallback to a simple circle if icon not found
        return (
            <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
                    <Circle cx="12" cy="12" r="10" />
                </Svg>
            </View>
        );
    }
    
    return (
        <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
            {iconRenderer(color, size, strokeWidth)}
        </View>
    );
};

export default Icon;
