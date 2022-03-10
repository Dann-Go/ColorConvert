import './App.css';
import {useState} from "react";

function App() {
    const XYZ_WHITE = [95.047, 100, 108.883];
    const [modelType, setModelType] = useState("RGB")
    const [RGB, setRGB] = useState([0, 0, 0])
    const [HSV, setHSV] = useState([0, 0, 0])
    const [LAB, setLAB] = useState([0, 0, 0])
    const [colorPicked, setColorPicked] = useState("#000000")

    function rgb2xyz(rgb) {
        let r = rgb[0] / 255;
        let g = rgb[1] / 255;
        let b = rgb[2] / 255;

        r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
        g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
        b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

        const x = (r * 0.4124564) + (g * 0.3575761) + (b * 0.1804375);
        const y = (r * 0.2126729) + (g * 0.7151522) + (b * 0.072175);
        const z = (r * 0.0193339) + (g * 0.119192) + (b * 0.9503041);

        return [x * 100, y * 100, z * 100];
    };

    function rgb2lab(rgb) {
        const xyz = rgb2xyz(rgb);
        let x = xyz[0];
        let y = xyz[1];
        let z = xyz[2];

        x /= 95.047;
        y /= 100;
        z /= 108.883;

        x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

        const l = (116 * y) - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);

        setLAB([l, a, b]);
    }

    function lab2rgb(lab) {
        let l = lab[0];
        let a = lab[1];
        let b = lab[2];
        l = Number(l)
        a = Number(a)
        b = Number(b)

        let x;
        let y;
        let z;

        y = (l + 16) / 116;
        x = a / 500 + y;
        z = y - b / 200;

        const y2 = y ** 3;
        const x2 = x ** 3;
        const z2 = z ** 3;
        y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
        x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
        z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

        x *= 95.047;
        y *= 100;
        z *= 108.883;


        xyz2rgb([x,y,z]);
    }

    function xyz2rgb(xyz) {

        const x = xyz[0] / 100;
        const y = xyz[1] / 100;
        const z = xyz[2] / 100;
        let r;
        let g;
        let b;

        r = (x * 3.2404542) + (y * -1.5371385) + (z * -0.4985314);
        g = (x * -0.969266) + (y * 1.8760108) + (z * 0.041556);
        b = (x * 0.0556434) + (y * -0.2040259) + (z * 1.0572252);

        // Assume sRGB
        r = r > 0.0031308
            ? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
            : r * 12.92;

        g = g > 0.0031308
            ? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
            : g * 12.92;

        b = b > 0.0031308
            ? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
            : b * 12.92;

        r = Math.min(Math.max(0, r), 1);
        g = Math.min(Math.max(0, g), 1);
        b = Math.min(Math.max(0, b), 1);

        setRGB( [parseInt(r * 255),parseInt(g * 255), parseInt(b * 255)]);

    }

    function hsv2rgb(hsv) {
        let h = hsv[0] / 360
        let s = hsv[1] / 100
        let v = hsv[2] / 100
        let r, g, b;

        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v
                g = t
                b = p
                break;
            case 1:
                r = q
                g = v
                b = p
                break;
            case 2:
                r = p
                g = v
                b = t
                break;
            case 3:
                r = p
                g = q
                b = v
                break;
            case 4:
                r = t
                g = p
                b = v
                break;
            case 5:
                r = v
                g = p
                b = q
                break;
        }

        setRGB([parseInt(r * 255), parseInt(g * 255), parseInt(b * 255)]);
    }

    function hsv2lab(HSV) {
        hsv2rgb(HSV)
        rgb2lab(RGB)
    }

    function rgb2hsv(r, g, b) {
        let rdif;
        let gdif;
        let bdif;
        let h;
        let s;

        r = r / 255;
        g = g / 255;
        b = b / 255;
        const v = Math.max(r, g, b);
        const diff = v - Math.min(r, g, b);
        const diffc = function (c) {
            return (v - c) / 6 / diff + 1 / 2;
        };

        if (diff === 0) {
            h = 0;
            s = 0;
        } else {
            s = diff / v;
            rdif = diffc(r);
            gdif = diffc(g);
            bdif = diffc(b);

            if (r === v) {
                h = bdif - gdif;
            } else if (g === v) {
                h = (1 / 3) + rdif - bdif;
            } else if (b === v) {
                h = (2 / 3) + gdif - rdif;
            }

            if (h < 0) {
                h += 1;
            } else if (h > 1) {
                h -= 1;
            }
        }
        setHSV([parseFloat(h * 360).toFixed(1), parseFloat(s * 100).toFixed(2), parseFloat(v * 100).toFixed(2)])
    }

    function lab2hsv(LAB) {
        lab2rgb(LAB)
        rgb2hsv(RGB[0], RGB[1], RGB[2])
    }

    function componentToHex(c) {
        c = Number(c);
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        setColorPicked("#" + componentToHex(r) + componentToHex(g) + componentToHex(b));
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        setRGB([parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]);
        rgb2hsv(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16))
        rgb2lab([parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)])
    }

    const handleSelectChange = (event) => {
        const picked = event.target.value;
        setModelType(picked)
    }

    const handleConvert = () => {
        if (modelType === "RGB") {
            rgbToHex(RGB[0], RGB[1], RGB[2])
            rgb2hsv(RGB[0], RGB[1], RGB[2])
            rgb2lab(RGB)
        } else if (modelType === "HSV") {
            hsv2rgb(HSV)
            hsv2lab(HSV)
        } else if (modelType === "LAB") {
            lab2rgb(LAB)
            lab2hsv(LAB)
        }
    }

    const handleColorPick = (event) => {
        setColorPicked(event.target.value);
        hexToRgb(event.target.value);

    }

    function handleRChange(event) {
        if (event.target.value < 0) {
            alert("Value can't be negative")
        } else if (event.target.value > 255) {
            alert("R should be less or even 255")
        } else {
            setRGB([event.target.value, RGB[1], RGB[2]]);
            rgb2hsv(event.target.value, RGB[1], RGB[2])
            rgbToHex(event.target.value, RGB[1], RGB[2])
            rgb2lab([event.target.value, RGB[1], RGB[2]])
        }
    }

    function handleGChange(event) {
        if (event.target.value < 0) {
            alert("Value can't be negative");
        } else if (event.target.value > 255) {
            alert("G should be less or even 255");
        } else {
            setRGB([RGB[0], event.target.value, RGB[2]]);
            rgb2hsv(RGB[0], event.target.value, RGB[2]);
            rgbToHex(RGB[0], event.target.value, RGB[2]);
            rgb2lab([RGB[0], event.target.value, RGB[2]])
        }
    }

    function handleBChange(event) {
        if (event.target.value < 0) {
            alert("Value can't be negative")
        } else if (event.target.value > 255) {
            alert("B should be less or even 255")
        } else {
            setRGB([RGB[0], RGB[1], event.target.value]);
            rgb2hsv(RGB[0], RGB[1], event.target.value)
            rgbToHex(RGB[0], RGB[1], event.target.value);
            rgb2lab([RGB[0], RGB[1], event.target.value])
        }
    }

    function handleHChange(event) {
        if (event.target.value < 0) {
            alert("Value can't be negative")
        } else if (event.target.value > 360) {
            alert("H should be less or even 360")
        } else {
            setHSV([event.target.value, HSV[1], HSV[2]]);
            hsv2rgb([event.target.value, HSV[1], HSV[2]])
            rgbToHex(RGB[0], RGB[1], RGB[2]);
            rgb2lab(RGB)
        }
    }

    function handleSChange(event) {
        if (event.target.value < 0) {
            alert("Value can't be negative")
        } else if (event.target.value > 100) {
            alert("S should be less or even 100")
        } else {
            setHSV([HSV[0], event.target.value, HSV[2]]);
            hsv2rgb([HSV[0], event.target.value, HSV[2]])
            rgbToHex(RGB[0], RGB[1], RGB[2]);
            rgb2lab(RGB)
        }
    }

    function handleVChange(event) {
        if (event.target.value < 0) {
            alert("Value can't be negative")
        } else if (event.target.value > 100) {
            alert("V should be less or even 100")
        } else {
            setHSV([HSV[0], HSV[1], event.target.value]);
            hsv2rgb([HSV[0], HSV[1], event.target.value])
            rgbToHex(RGB[0], RGB[1], RGB[2]);
            rgb2lab(RGB)
        }
    }

    function handleLChange(event) {
        setLAB([event.target.value, LAB[1], LAB[2]]);
        if (event.target.value < 0) {
            alert("Value can't be negative")
        } else if (event.target.value > 100) {
            alert("A should be less or even 100")
        } else {
            setLAB([event.target.value, LAB[1], LAB[2]]);
            rgb2hsv(RGB[0], RGB[1], RGB[2])
            rgbToHex(RGB[0], RGB[1], RGB[2]);
            lab2rgb([event.target.value, LAB[1], LAB[2]])
        }
    }

    function handleAChange(event) {

        if (event.target.value < -128) {
            alert("Value can't be lower then -128")
        } else if (event.target.value > 127) {
            alert("A should be less or even 127")
        } else {
            setLAB([LAB[0], event.target.value, LAB[2]]);
            rgb2hsv(RGB[0], RGB[1], RGB[2])
            rgbToHex(RGB[0], RGB[1], RGB[2]);
            lab2rgb([LAB[0], event.target.value, LAB[2]])
        }
    }

    function handleBLabChange(event) {
        if (event.target.value < -128) {
            alert("Value can't be lower then -128")
        } else if (event.target.value > 127) {
            alert("B should be less or even 127")
        } else {
            setLAB([LAB[0], LAB[1], event.target.value]);
            lab2rgb([LAB[0], LAB[1], event.target.value])
            rgb2hsv(RGB[0], RGB[1], RGB[2])
            rgbToHex(RGB[0], RGB[1], RGB[2]);
        }
    }

    return (
        <div className="App">
            <div className="App__body">
                <div className="App__color-picker">
                    <input type="color" className="ColorPicker" onChange={handleColorPick} value={colorPicked}/>
                </div>
                <div className="App__color-select">
                    <select className="ColorSelect" onChange={handleSelectChange}>
                        <option value="RGB">RGB</option>
                        <option value="HSV">HSV</option>
                        <option value="LAB">LAB</option>
                    </select>
                </div>
                <div className="RGB">
                    <label>R</label>
                    <input type="number" min="0" max="255" disabled={modelType != "RGB" ? true : false} value={RGB[0]}
                           onChange={handleRChange}/>
                    <label>G</label>
                    <input type="number" min="0" max="255" disabled={modelType != "RGB" ? true : false} value={RGB[1]}
                           onChange={handleGChange}/>
                    <label>B</label>
                    <input type="number" min="0" max="255" disabled={modelType != "RGB" ? true : false} value={RGB[2]}
                           onChange={handleBChange}/>
                </div>
                <div className="HSV">
                    <label>H</label>
                    <input type="number" min="0" max="360" disabled={modelType != "HSV" ? true : false} value={HSV[0]}
                           onChange={handleHChange}/>
                    <label>S</label>
                    <input type="number" min="0" max="100" disabled={modelType != "HSV" ? true : false} value={HSV[1]}
                           onChange={handleSChange}/>
                    <label>V</label>
                    <input type="number" min="0" max="100" disabled={modelType != "HSV" ? true : false} value={HSV[2]}
                           onChange={handleVChange}/>
                </div>
                <div className="LAB">
                    <label>L</label>
                    <input type="number" min="0" max="100" disabled={modelType != "LAB" ? true : false} value={LAB[0]}
                           onChange={handleLChange}/>
                    <label>A</label>
                    <input type="number" min="-128" max="127" disabled={modelType != "LAB" ? true : false}
                           value={LAB[1]} onChange={handleAChange}/>
                    <label>B</label>
                    <input type="number" min="-128" max="127" disabled={modelType != "LAB" ? true : false}
                           value={LAB[2]} onChange={handleBLabChange}/>
                </div>
                <div className="btn__convert">
                    <button onClick={handleConvert}>Convert</button>
                </div>
            </div>
        </div>
    );
}

export default App;
