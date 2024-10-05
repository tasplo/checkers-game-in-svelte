# Checkers Game

This is a web-based Checkers Game built using Svelte for the front end and TypeScript for type safety. The game allows players to experience the classic game of checkers with intuitive move highlighting, support for multiple captures, and game state management.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [How to Play](#how-to-play)
- [Game Logic](#game-logic)
- [Contributing](#contributing)

### Features

- Classic Checkers Rules: Two-player game supporting alternating turns and standard checkers moves.
- Multiple Capture Moves: Detect and allow multiple captures when possible, with visual feedback.
- Move Highlights: Display available moves and captures with visual cues on the game board.
- King Promotion: When a piece reaches the opponent’s last row, it is promoted to a King and can move both forward and backward.
- Dynamic Board Rendering: The game board and pieces update dynamically based on the current state.
- Responsive Design: Scales well across different screen sizes.

### Technologies

- Svelte: A lightweight JavaScript framework for building UI.
- TypeScript: For static type-checking and better development experience.
- Vite: Fast build tool used for development and bundling the app.
- Tailwind CSS: Utility-first CSS framework for styling.

### Installation

To get started with the project locally, follow these steps:

Clone the repository:

```bash
git clone <https://github.com/tasplo/checkers-game-in-svelte.git>
cd checkers-game
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

The application should now be running on <http://localhost:3000>.

### How to Play

1. Start the game: Load the application in your browser. The checkers board will render with pieces positioned at their starting points.
2. Make a move: Click on a piece to view its available moves. Legal moves will be highlighted with an indicator.
3. Capture moves: If a piece can make a capture, the possible capture squares will be highlighted. Click on a highlighted square to perform the capture.
4. King Promotion: When a piece reaches the last row on the opponent’s side, it is promoted to a King. Kings can move both forward and backward.
5. Winning: The game continues until one player has no pieces or moves left, signaling the end of the game.

### Game Logic

The game logic is handled in the game.ts file within the Svelte Store. This includes:

- Move generation: Both normal and capture moves are generated based on the current board state.
- King promotion: Pieces reaching the far end of the board are promoted to Kings.
- Capture logic: If a piece can capture an opponent’s piece, it highlights all available capture paths, including chained captures.
- Turn management: The game alternates turns between players and handles player input accordingly.

#### Example: Move and Capture Logic

Here’s an overview of how the logic works for detecting capture moves:

```typescript
$: if (must_capture && selected.length) {
  captureMoves = [];

  captures.forEach((capture) => {
    if (capture.start.toString() === selected.toString()) {
      captureMoves.push(capture.end);
    }
    captureMoves.forEach((_move) => {
      if (_move.toString() === capture.start.toString()) {
        captureMoves.push(capture.end);
      }
    });
  });
}
```

This ensures that multi-capture moves are correctly tracked and displayed.

### Contributing

We welcome contributions! If you have an idea for a feature or a bug fix, feel free to fork the repository and open a pull request. Please follow these steps:

- Fork the project.
- Create a new branch for your feature or bugfix.
- Commit your changes and push the branch.
- Submit a pull request.

#### Reporting Issues

If you encounter any issues or bugs, please open an issue on the repository. Include detailed steps to reproduce the issue for faster resolution.

Enjoy the game! 🎮
