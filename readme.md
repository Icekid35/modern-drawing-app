
# 🖌️ Modern Drawing App

A powerful, browser-based drawing tool built using **p5.js**, **HTML**, and **CSS**. Designed to bring digital creativity into the browser with features like symmetry, particle brushes, playback, dark mode, layers, and more.

---

## 🚀 Live Demo
> 🔗 [Click here to try the app live](#)  
> *(Add your deployed link here when available)*

---

## 📌 Features

- 🎨 **Customizable Brushes** – Adjustable size, color, opacity, blend mode
- ✨ **Particle Effects** – Toggle special effect brushes for dazzling results
- 🪞 **Symmetry Tools** – Horizontal and vertical symmetry for mandala-style art
- 🌘 **Dark Mode** – Switch themes with a single click (or press `D`)
- 🧠 **Undo/Redo** – Supports multiple layers and history tracking (`Ctrl+Z`, `Ctrl+Y`)
- 🧱 **Layer Support** – Separate drawings into two modifiable layers
- ⏯️ **Playback Feature** – Replay your drawing process from beginning to end
- 🖼️ **Background Loader** – Upload your own image to draw on
- ⌨️ **Keyboard Shortcuts** – Speed up your workflow with quick-access keys
- 📱 **Responsive UI** – Mobile-friendly with touch support and hamburger menu

---

## 🧠 Concept & Purpose

This project was inspired by modern creative tools like **Adobe Fresco** and **Procreate**. The idea was to build an intuitive, yet powerful drawing environment directly in the browser — ideal for hobbyists, students, and digital artists.

---

## 🏗️ Technologies Used

- **[p5.js](https://p5js.org/)** – Creative coding canvas engine
- **HTML5/CSS3** – Layout, theming, and UI controls
- **Vanilla JavaScript** – DOM handling, event listeners, and custom logic
- **Font Awesome** – Icon set for clean UI controls

---

## 🧩 Development Notes

### Key Challenges and Solutions:

| Challenge | Solution |
|----------|----------|
| Playback | Recorded each stroke into a `recording[]` array and replayed frame-by-frame using `playIndex` |
| Undo/Redo per Layer | Managed separate shape arrays for each layer and respective undo/redo stacks |
| Theme Switching | Used toggle states and conditional background rendering |
| Symmetry Drawing | Mirrored shapes in real time by inverting coordinates along X and Y axes |
| Mobile Support | Integrated responsive design + a toggleable side menu for smaller screens |

---

## 🛠️ How to Use / Build

```bash
# Clone the repository
git clone https://github.com/icekid35/modern-drawing-app.git

# Open index.html in your browser
```

> Make sure to include `p5.js`, and `Font Awesome` CDN links in `index.html`.

---

## 📚 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Undo | `Ctrl + Z` |
| Redo | `Ctrl + Y` |
| Save Drawing | `Ctrl + S` |
| Toggle Particle Brush | `P` |
| Toggle Horizontal Symmetry | `H` |
| Toggle Vertical Symmetry | `V` |
| Toggle Dark Mode | `D` |
| Switch Layers | `L` |
| Playback Drawing | `K` |

---

## ✅ Future Plans

- 🖌️ More brush types (e.g., spray, textured)
- 🧾 Multi-layer support with blend modes
- ☁️ Cloud saving or export to SVG
- 🎞️ Adjustable playback speed & pause controls

---

## 🧑‍💻 Author

**Bello Habeebullahi Ajetola**  
Feel free to connect with me on [Instagram](https://instagram.com/javascriptpro1) or [GitHub](https://github.com/Icekid35)!

---

## 📄 License

MIT License. Free to use, modify, and build upon.

