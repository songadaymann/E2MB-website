// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "../IRenderTypes.sol";

library CountdownRenderer {
    using Strings for uint256;
    using RenderTypes for RenderTypes.RenderCtx;

    function render(RenderTypes.RenderCtx memory ctx) internal pure returns (string memory) {
        // Opacity ramp: 0.15 + 0.85 * closeness
        string memory opacity = _bpsToDec4(uint16(1500 + (uint256(8500) * ctx.closenessBps) / 10000));
        string memory bg = _grayCss(uint16(10000 - ctx.closenessBps));
        // Ensure strong contrast for digits/year against background
        string memory digitCol = (ctx.closenessBps >= 5000) ? "rgb(255,255,255)" : "rgb(0,0,0)";

        string memory head = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 360 420" width="360" height="420">',
            '<defs>', _digitDefs(), _clip(), '</defs>',
            '<rect width="100%" height="100%" fill="', bg, '"/>'
        ));

        string memory rows = string(abi.encodePacked(
            _rowGroup(80,  ctx.blocksDisplay, digitCol, opacity, ctx.nowTs, 100000000000, 10000000000, 1000000000, 100000000),
            _rowGroup(140, ctx.blocksDisplay, digitCol, opacity, ctx.nowTs, 10000000, 1000000, 100000, 10000),
            _rowGroup(200, ctx.blocksDisplay, digitCol, opacity, ctx.nowTs, 1000, 100, 10, 1)
        ));
        string memory yr = _year(ctx.revealYear, digitCol);
        return string(abi.encodePacked(head, rows, yr, '</svg>'));
    }

    function _rowGroup(uint256 y, uint256 displayNumber, string memory col, string memory opacity, uint256 nowTs,
        uint256 d3, uint256 d2, uint256 d1, uint256 d0
    ) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<g transform="translate(65, ', y.toString(), ')">',
            _col(0,   (displayNumber / d3) % 10, col, opacity, (d3 == 1 ? 120 : (d3 * 12)), d3 != 1, nowTs),
            _col(60,  (displayNumber / d2) % 10, col, opacity, (d2 == 1 ? 120 : (d2 * 12)), d2 != 1, nowTs),
            _col(120, (displayNumber / d1) % 10, col, opacity, (d1 == 1 ? 120 : (d1 * 12)), d1 != 1, nowTs),
            _col(180, (displayNumber / d0) % 10, col, opacity, (d0 == 1 ? 120 : (d0 * 12)), d0 != 1, nowTs),
            '</g>'
        ));
    }

    function _col(uint256 xPos, uint256 startDigit, string memory color, string memory opacity, uint256 cycleSeconds, bool discrete, uint256 nowTs) private pure returns (string memory) {
        startDigit = startDigit % 10;
        uint256 elapsed = cycleSeconds == 0 ? 0 : (nowTs % cycleSeconds);
        string memory anim;
        string memory initialY;
        if (discrete) {
            uint256 step = cycleSeconds / 10;
            uint256 timeInto = step == 0 ? 0 : (elapsed % step);
            uint256 timeToNext = step == 0 ? 0 : (step - timeInto) % step;
            string memory beginAttr = string(abi.encodePacked(_u2s(timeToNext), "s"));
            string memory durAttr = string(abi.encodePacked(_u2s(step * 10), "s"));
            initialY = "0";
            anim = string(abi.encodePacked(
                '<animateTransform attributeName="transform" type="translate" calcMode="discrete" ',
                'values="13 0;13 -50;13 -100;13 -150;13 -200;13 -250;13 -300;13 -350;13 -400;13 -450;13 -500;13 0" ',
                'keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.8;0.9;1" dur="', durAttr, '" begin="', beginAttr, '" repeatCount="indefinite"/>'
            ));
        } else {
            int256 y0 = -int256((500 * elapsed) / (cycleSeconds == 0 ? 1 : cycleSeconds));
            uint256 tRem = cycleSeconds == 0 ? 0 : ((cycleSeconds - elapsed) % cycleSeconds);
            initialY = _i2s(y0);
            string memory firstDur = string(abi.encodePacked(_u2s(tRem), "s"));
            string memory loopDur = string(abi.encodePacked(_u2s(cycleSeconds), "s"));
            anim = string(abi.encodePacked(
                '<animateTransform attributeName="transform" type="translate" from="13 ', _i2s(y0), '" to="13 -500" dur="', firstDur, '" begin="0s" fill="freeze"/>',
                '<animateTransform attributeName="transform" type="translate" from="13 0" to="13 -500" dur="', loopDur, '" begin="', firstDur, '" repeatCount="indefinite"/>'
            ));
        }
        return string(abi.encodePacked(
            '<g transform="translate(', xPos.toString(), ', 0)" clip-path="url(#digitWindow)">',
            '<g fill="', color, '" fill-opacity="', opacity, '" shape-rendering="crispEdges">',
            '<g transform="translate(13, ', initialY, ')">',
            _seq(startDigit), anim,
            '</g></g></g>'
        ));
    }

    function _digitDefs() private pure returns (string memory) {
        return string(abi.encodePacked(
            '<g id="d0" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="-4" y="4" width="4" height="16"/><rect x="16" y="4" width="4" height="16"/><rect x="-4" y="22" width="4" height="16"/><rect x="16" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>',
            '<g id="d1" transform="translate(4,0)"><rect x="16" y="4" width="4" height="16"/><rect x="16" y="22" width="4" height="16"/></g>',
            '<g id="d2" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="16" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="-4" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>',
            '<g id="d3" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="16" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="16" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>',
            '<g id="d4" transform="translate(4,0)"><rect x="-4" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="16" y="4" width="4" height="16"/><rect x="16" y="22" width="4" height="16"/></g>',
            '<g id="d5" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="-4" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="16" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>',
            '<g id="d6" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="-4" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="-4" y="22" width="4" height="16"/><rect x="16" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>',
            '<g id="d7" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="16" y="4" width="4" height="16"/><rect x="16" y="22" width="4" height="16"/></g>',
            '<g id="d8" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="-4" y="4" width="4" height="16"/><rect x="16" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="-4" y="22" width="4" height="16"/><rect x="16" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>',
            '<g id="d9" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="-4" y="4" width="4" height="16"/><rect x="16" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="16" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>'
        ));
    }

    function _clip() private pure returns (string memory) {
        return '<clipPath id="digitWindow" clipPathUnits="userSpaceOnUse"><rect x="0" y="0" width="50" height="50"/></clipPath>';
    }

    function _year(uint256 year, string memory fillColor) private pure returns (string memory) {
        string memory d1 = ((year / 1000) % 10).toString();
        string memory d2 = ((year / 100) % 10).toString();
        string memory d3 = ((year / 10) % 10).toString();
        string memory d4 = (year % 10).toString();
        return string(abi.encodePacked(
            '<g transform="translate(38, 310)" fill="', fillColor, '"><g transform="scale(1.5)">',
            '<use href="#d', d1, '" x="0" y="0"/>',
            '<use href="#d', d2, '" x="55" y="0"/>',
            '<use href="#d', d3, '" x="110" y="0"/>',
            '<use href="#d', d4, '" x="165" y="0"/>',
            '</g></g>'
        ));
    }

    function _seq(uint256 startDigit) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<use href="#d', startDigit.toString(), '" y="0"/>',
            '<use href="#d', ((startDigit + 9) % 10).toString(), '" y="50"/>',
            '<use href="#d', ((startDigit + 8) % 10).toString(), '" y="100"/>',
            '<use href="#d', ((startDigit + 7) % 10).toString(), '" y="150"/>',
            '<use href="#d', ((startDigit + 6) % 10).toString(), '" y="200"/>',
            '<use href="#d', ((startDigit + 5) % 10).toString(), '" y="250"/>',
            '<use href="#d', ((startDigit + 4) % 10).toString(), '" y="300"/>',
            '<use href="#d', ((startDigit + 3) % 10).toString(), '" y="350"/>',
            '<use href="#d', ((startDigit + 2) % 10).toString(), '" y="400"/>',
            '<use href="#d', ((startDigit + 1) % 10).toString(), '" y="450"/>',
            '<use href="#d', startDigit.toString(), '" y="500"/>'
        ));
    }

    function _grayCss(uint16 gBps) private pure returns (string memory) {
        uint8 b = uint8((uint32(gBps) * 255 + 5000) / 10000);
        return string(abi.encodePacked("rgb(", uint256(b).toString(), ",", uint256(b).toString(), ",", uint256(b).toString(), ")"));
    }

    function _bpsToDec4(uint16 bps) private pure returns (string memory) {
        if (bps >= 10000) return "1";
        uint256 frac = uint256(bps % 10000);
        return string(abi.encodePacked("0.", _pad4(frac)));
    }

    function _pad4(uint256 v) private pure returns (string memory) {
        if (v >= 1000) return v.toString();
        if (v >= 100)  return string(abi.encodePacked("0", v.toString()));
        if (v >= 10)   return string(abi.encodePacked("00", v.toString()));
        return string(abi.encodePacked("000", v.toString()));
    }

    function _i2s(int256 v) private pure returns (string memory) {
        if (v == 0) return "0";
        bool neg = v < 0;
        uint256 u = uint256(neg ? -v : v);
        string memory s = u.toString();
        return neg ? string(abi.encodePacked("-", s)) : s;
    }

    function _u2s(uint256 v) private pure returns (string memory) {
        return v.toString();
    }
}
