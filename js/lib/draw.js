class Draw {
  /*
   * Return a parsed color given as a String or an Array of Numbers.
   */
  static parseColor(color) {
    const MAX_COLOR = 255;
    if (typeof color === "string") {
      if (color.length < 3) {
        return "black";
      } else {
        return color;
      }
    } else {
      let [r = 0, g = 0, b = 0, a = MAX_COLOR] = color;
      r = Math.max(0, Math.min(r, MAX_COLOR));
      g = Math.max(0, Math.min(g, MAX_COLOR));
      b = Math.max(0, Math.min(b, MAX_COLOR));
      a = Math.max(0, Math.min(a, MAX_COLOR));
      if (a >= MAX_COLOR) {
        return `rgb(${r}, ${g}, ${b})`;
      } else {
        // alpha component of rgba has to be between 0 and 1, inclusive
        return `rgba(${r}, ${g}, ${b}, ${a / MAX_COLOR})`;
      }
    }
  }

  /*
   * Return the longest line in lines or the empty string.
   */
  static getLongest(lines) {
    if (lines.length <= 0) {
      return "";
    }

    let longest = 0;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].length > lines[longest].length) {
        longest = i;
      }
    }
    return lines[longest];
  }

  static create(context, width, height) {
    const TWO_PI = Math.PI * 2;
    const DEFAULT_FONT = "sans-serif";
    const DEFAULT_FONT_COLOR = "white";
    const DEFAULT_FONT_SIZE = 24;
    const DEFAULT_LINE_HEIGHT = 1.0;
    const TAB_REGEX = /\t/g;
    const TAB_REPLACEMENT = "    ";

    return {
      /*text(x, y, text, font, color) {
                context.save();
                context.font = font;
                context.fillStyle = color;
                context.fillText(text, x, y);
                context.restore();
            },*/
      line(start, end, color, width = 1, dashArray = null, dashOffset = 0) {
        if (context == null) {
          return;
        }
        context.save();
        context.lineWidth = width;
        context.strokeStyle = Draw.parseColor(color);
        if (Array.isArray(dashArray)) {
          dashArray = dashArray.filter((v) => typeof v === "number");
          if (dashArray.length > 0) {
            context.setLineDash(dashArray);
            if (typeof dashOffset === "number") {
              context.lineDashOffset = dashOffset;
            }
          }
        }

        let [x1 = 0, y1 = 0] = start,
          [x2 = 0, y2 = 0] = end;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.restore();
      },
      circle(
        pos,
        radius,
        color,
        width = 1,
        start = 0,
        end = 360,
        dashArray = null,
        dashOffset = 0,
      ) {
        if (context == null) {
          return;
        }

        if (typeof start === "number") {
          while (start < 0) {
            start += 360;
          }
          start = ((start % 360) * Math.PI) / 180;
        } else {
          start = 0;
        }

        if (typeof end === "number") {
          end = end % 360;
          if (end === 0) {
            // If end is a multiple of 360, then make sure it goes around once
            end = TWO_PI;
          } else {
            end = (end * Math.PI) / 180;
          }
        } else {
          end = TWO_PI;
        }

        context.save();
        context.lineWidth = width;
        context.strokeStyle = Draw.parseColor(color);
        if (Array.isArray(dashArray)) {
          dashArray = dashArray.filter((v) => typeof v === "number");
          if (dashArray.length > 0) {
            context.setLineDash(dashArray);
            if (typeof dashOffset === "number") {
              context.lineDashOffset = dashOffset;
            }
          }
        }

        let [x = 0, y = 0] = pos;
        context.beginPath();
        // Pygame Zero has 90 degrees at 12 o'clock and 180 degrees at 9 o'clock
        context.arc(x, y, radius, -start, -end, true);
        context.stroke();
        context.restore();
      },
      filled_circle(pos, radius, color, start = 0, end = 360) {
        if (context == null) {
          return;
        }

        if (typeof start === "number") {
          while (start < 0) {
            start += 360;
          }
          start = ((start % 360) * Math.PI) / 180;
        } else {
          start = 0;
        }

        if (typeof end === "number") {
          end = end % 360;
          if (end === 0) {
            // If end is a multiple of 360, then make sure it goes around once
            end = TWO_PI;
          } else {
            end = (end * Math.PI) / 180;
          }
        } else {
          end = TWO_PI;
        }

        context.save();
        if (color == "erase") {
          context.globalCompositeOperation = "destination-out";
          context.fillStyle = "black";
        } else {
          context.fillStyle = Draw.parseColor(color);
        }

        let [x = 0, y = 0] = pos;
        context.beginPath();
        // Pygame Zero has 90 degrees at 12 o'clock and 180 degrees at 9 o'clock
        context.arc(x, y, radius, -start, -end, true);
        context.fill();
        context.restore();
      },
      polygon(points, color, width = 1, dashArray = null, dashOffset = 0) {
        if (context == null) {
          return;
        }
        context.save();
        context.lineWidth = width;
        context.strokeStyle = Draw.parseColor(color);
        if (Array.isArray(dashArray)) {
          dashArray = dashArray.filter((v) => typeof v === "number");
          if (dashArray.length > 0) {
            context.setLineDash(dashArray);
            if (typeof dashOffset === "number") {
              context.lineDashOffset = dashOffset;
            }
          }
        }

        context.beginPath();
        let isFirst = true,
          x,
          y;
        for (let point of points) {
          [x = 0, y = 0] = point;
          if (isFirst) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
          isFirst = false;
        }
        // Explicitly close the polygon
        context.closePath();
        context.stroke();
        context.restore();
      },
      filled_polygon(points, color) {
        if (context == null) {
          return;
        }
        context.save();
        context.fillStyle = Draw.parseColor(color);

        context.beginPath();
        let isFirst = true,
          x,
          y;
        for (let point of points) {
          [x = 0, y = 0] = point;
          if (isFirst) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
          isFirst = false;
        }
        context.fill();
        context.restore();
      },
      rect(rect, color, width = 1, dashArray = null, dashOffset = 0) {
        if (!(rect instanceof Rect)) {
          throw new TypeError("rect must be a Rect.");
        }
        if (context == null) {
          return;
        }
        context.save();
        context.lineWidth = width;
        context.strokeStyle = Draw.parseColor(color);
        if (Array.isArray(dashArray)) {
          dashArray = dashArray.filter((v) => typeof v === "number");
          if (dashArray.length > 0) {
            context.setLineDash(dashArray);
            if (typeof dashOffset === "number") {
              context.lineDashOffset = dashOffset;
            }
          }
        }
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        context.restore();
      },
      filled_rect(rect, color) {
        if (!(rect instanceof Rect)) {
          throw new TypeError("rect must be a Rect.");
        }
        if (context == null) {
          return;
        }
        context.save();
        if (color == "erase") {
          context.globalCompositeOperation = "destination-out";
          context.fillStyle = "black";
        } else {
          context.fillStyle = Draw.parseColor(color);
        }
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
        context.restore();
      },
      text(text, config) {
        screen.draw.textbox(text, null, config);
      },
      textbox(text, rect, config) {
        if (typeof text !== "string") {
          return;
        }
        if (context == null) {
          return;
        }
        context.save();

        let fontSize = DEFAULT_FONT_SIZE,
          fontName = DEFAULT_FONT,
          lineHeight = DEFAULT_LINE_HEIGHT,
          color = DEFAULT_FONT_COLOR,
          drawOutline = false,
          // Use replace() and a regular expression
          // because it has wider support than replaceAll()
          lines = text.replace(TAB_REGEX, TAB_REPLACEMENT).split("\n"),
          gcolor,
          x,
          y;

        if ("fontsize" in config && typeof config["fontsize"] === "number") {
          fontSize = config["fontsize"];
        }
        if ("fontname" in config && typeof config["fontname"] === "string") {
          fontName = config["fontname"];
        }
        context.font = fontSize + "px " + fontName;

        if (
          "lineheight" in config &&
          typeof config["lineheight"] === "number"
        ) {
          lineHeight = config["lineheight"];
        }

        context.textAlign = "left";
        context.textBaseline = "top";
        if (rect instanceof Rect) {
          // Change fontSize so text fits inside rect
          const longestLine = Draw.getLongest(lines);
          while (fontSize > 0) {
            if (
              context.measureText(longestLine).width < rect.width &&
              lines.length * fontSize * lineHeight < rect.height
            ) {
              break;
            }
            fontSize--;
            context.font = fontSize + "px " + fontName;
          }

          ({ x = 0, y = 0 } = rect);
        } else {
          // Not constrained to fit inside rect
          let yOffset = (lines.length - 1) * fontSize * lineHeight;
          if ("topleft" in config) {
            [x = 0, y = 0] = config["topleft"];
          } else if ("midtop" in config) {
            [x = 0, y = 0] = config["midtop"];
            context.textAlign = "center";
            context.textBaseline = "top";
          } else if ("topright" in config) {
            [x = 0, y = 0] = config["topright"];
            context.textAlign = "right";
            context.textBaseline = "top";
          } else if ("midleft" in config) {
            [x = 0, y = 0] = config["midleft"];
            y -= Math.floor(yOffset / 2);
            context.textAlign = "left";
            context.textBaseline = "middle";
          } else if ("center" in config) {
            [x = 0, y = 0] = config["center"];
            y -= Math.floor(yOffset / 2);
            context.textAlign = "center";
            context.textBaseline = "middle";
          } else if ("midright" in config) {
            [x = 0, y = 0] = config["midright"];
            y -= Math.floor(yOffset / 2);
            context.textAlign = "right";
            context.textBaseline = "middle";
          } else if ("bottomleft" in config) {
            [x = 0, y = 0] = config["bottomleft"];
            y -= yOffset;
            context.textAlign = "left";
            context.textBaseline = "bottom";
          } else if ("midbottom" in config) {
            [x = 0, y = 0] = config["midbottom"];
            y -= yOffset;
            context.textAlign = "center";
            context.textBaseline = "bottom";
          } else if ("bottomright" in config) {
            [x = 0, y = 0] = config["bottomright"];
            y -= yOffset;
            context.textAlign = "right";
            context.textBaseline = "bottom";
          } else if ("pos" in config) {
            [x = 0, y = 0] = config["pos"];
          }
        }

        if ("alpha" in config && typeof config["alpha"] === "number") {
          context.globalAlpha = Math.max(0, Math.min(config["alpha"], 1));
        }
        if ("color" in config) {
          color = Draw.parseColor(config["color"]);
        }
        if ("gcolor" in config) {
          gcolor = Draw.parseColor(config["gcolor"]);
        }
        if ("owidth" in config && typeof config["owidth"] === "number") {
          drawOutline = true;
          context.lineWidth = config["owidth"];
          if ("ocolor" in config) {
            context.strokeStyle = Draw.parseColor(config["ocolor"]);
          }
        }
        if ("shadow" in config) {
          let [sdx = 0, sdy = 0] = config["shadow"];
          context.shadowOffsetX = sdx;
          context.shadowOffsetY = sdy;
          if ("scolor" in config) {
            context.shadowColor = Draw.parseColor(config["scolor"]);
          }
        }

        context.fillStyle = color;
        let lineSize = fontSize * lineHeight,
          lineY = y,
          gradient;
        for (let line of lines) {
          if (gcolor != null) {
            // The linear gradient repeats for each line
            if (context.textBaseline === "bottom") {
              gradient = context.createLinearGradient(
                0,
                lineY - lineSize,
                0,
                lineY,
              );
            } else if (context.textBaseline === "middle") {
              gradient = context.createLinearGradient(
                0,
                lineY - Math.floor(lineSize / 2),
                0,
                lineY + Math.floor(lineSize / 2),
              );
            } else {
              gradient = context.createLinearGradient(
                0,
                lineY,
                0,
                lineY + lineSize,
              );
            }
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, gcolor);
            context.fillStyle = gradient;
          }

          context.fillText(line, x, lineY);
          if (drawOutline) {
            context.strokeText(line, x, lineY);
          }

          lineY += lineSize;
        }
        context.restore();
      },

      /*
       * Draw the play button.
       */
      _playButton() {
        let x = Math.floor(width / 2),
          y = Math.floor(height / 2);
        screen.clear();
        screen.draw.filled_circle([x, y], 25, "white");
        screen.draw.filled_polygon(
          [
            [x + 11, y],
            [x - 6, y - 10],
            [x - 6, y + 10],
          ],
          "black",
        );
      },
    };
  }
}
