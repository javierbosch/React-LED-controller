import React, { useState } from 'react';
import axios from 'axios';
import { ChromePicker } from 'react-color';

const LedController = () => {

    const [selectedMode, setSelectedMode] = useState(1);
    const [selectedColors, setSelectedColors] = useState({ 1: '#FFFFFF', 2: '#FFFFFF' });

    const [brightness, setBrightness] = useState(20);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const apiUrl = 'http://192.168.0.37:5000';

    const predefinedColors = [
        '#FFFFF0', // ivory
        '#FFD700', // daylight (closest to gold)
        '#F0E68C', // cool white (closest to khaki)
        '#F5DEB3', // warm white (closest to wheat)
        '#FFE4C4', // incandescent (closest to bisque)
        '#FFFACD', // candlelight (closest to lemon chiffon)
        '#FFFAFA', // snow
        '#F8F8FF', // ghost white
        '#F0F8FF', // alice blue
        '#EEDD82', // light goldenrod
        '#FFFACD', // lemon chiffon
        '#FAEBD7', // antique white
        '#CD853F', // peru
        '#D2691E', // chocolate
        '#F4A460', // sandy brown
        '#FF7F50', // coral
        '#FF7518', // pumpkin (closest to custom pumpkin color)
        '#FF6347', // tomato
        '#E34234', // vermilion (closest to custom vermilion color)
        '#FF4500', // orange red
        '#FFC0CB', // pink
        '#DC143C', // crimson
        '#FF0000', // red
        '#8B0000', // dark red
        '#FF69B4', // hot pink
        '#C84186', // smitten (closest to custom smitten color)
        '#FF00FF', // magenta
        '#9370DB', // medium purple
        '#8A2BE2', // blue violet
        '#4B0082', // indigo
        '#87CEFA', // light sky blue
        '#6495ED', // cornflower blue
        '#120A8F', // ultramarine (closest to custom ultramarine color)
        '#00BFFF', // deep sky blue
        '#007FFF', // azure (closest to custom azure color)
        '#000080', // navy blue
        '#AFEEEE', // light turquoise (closest to pale turquoise)
        '#7FFFD4', // aquamarine
        '#40E0D0', // turquoise
        '#90EE90', // light green
        '#00FF00', // lime
        '#228B22', // forest green
        '#000000', // black
    ];
    
    const handleColorChange = (color) => {
        setSelectedColors({ ...selectedColors, [selectedMode]: color.hex });
        setLightColor(selectedMode, color.hex);
    };
    
    const setColorOption = (color) => {
        setSelectedColors({ ...selectedColors, [selectedMode]: color });
        setLightColor(selectedMode, color);
    };
    
    const handleBrightnessChange = (e) => {
        setBrightness(e.target.value);
        setLightBrightness(e.target.value);
    };
        
    const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
    };
        
    const setLightColor = async (mode, color) => {
        const rgb = hexToRgb(color);
        const rgbString = `${rgb.r},${rgb.g},${rgb.b}`;
        try {
            await axios.get(`${apiUrl}/set-light?rgb=${rgbString}&mode=${mode}`);
        } catch (error) {
            console.error('Error setting light color:', error);
        }
    };

    const setLightBrightness = async (value) => {
        try {
            await axios.get(`${apiUrl}/set-brightness?brightness=${value}`);
        } catch (error) {
            console.error('Error setting brightness:', error);
        }
    };

    const renderColorOptions = () => {
        return predefinedColors.map((color) => (
            <button
                key={color}
                style={{ backgroundColor: color }}
                onClick={() => setColorOption(color)}
            />
        ));
    };

    const handleColorPickerToggle = () => {
        setShowColorPicker((prevShowColorPicker) => !prevShowColorPicker);
    };

    const handleTopButtonClick = () => {
        setSelectedMode(1);
    };
    
    const handleBottomButtonClick = () => {
        setSelectedMode(2);
    };

    const handleTurnOff = async () => {
        try {
            await axios.get(`${apiUrl}/turn-off`);
        } catch (error) {
            console.error('Error turning off:', error);
        }
    };
    
    return (
        <div>
            <h1>Desk LED Controller</h1>
            <div>
            <div className="brightness-control">
                <div className="slider-container">
                    <input
                        className="slider"
                        type="range"
                        min="0"
                        max="100"
                        value={brightness}
                        onChange={handleBrightnessChange}
                    />
                    <span className="brightness-value">{brightness}%</span>
                </div>
            </div>
            <button
                className={`button ${selectedMode === 1 ? 'button-selected' : ''}`}
                onClick={handleTopButtonClick}
            >
                Top Strip
            </button>
            <button
                className={`button ${selectedMode === 2 ? 'button-selected' : ''}`}
                onClick={handleBottomButtonClick}
            >
                Bottom Strip
            </button>
            </div>

            <div className="color-container">
                <div className="predefined-colors">{renderColorOptions()}</div>
            </div>
            <div>
                <button className={ "button-off" } onClick={handleTurnOff}>Turn off</button>
            </div>
            <div>
            <button className={ "button" } onClick={handleColorPickerToggle}>Toggle Color Picker</button>
                {showColorPicker && (
                    <div className="chrome-picker-container">
                        <ChromePicker color={selectedColors[selectedMode]} onChange={handleColorChange} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LedController;