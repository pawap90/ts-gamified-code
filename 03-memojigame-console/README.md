The goal of this challenge is to apply the concepts explained during Level 2:

- Type annotations
- Primitive types
- Anonymous object types

The code used relies mainly on those concepts plus vanilla JavaScript. 

![imagen](https://user-images.githubusercontent.com/2507959/182983514-44005c20-08ec-455e-af2b-f32b9d831b8d.png)

The project is a tile matching game where the player must flip one tile and then remember where its matching pair was and flip it. If they find the match, the tiles go green, indicating that those two are "cleared". If the two flipped tiles don't match, then they go back to their initial state (represented by a ❓ emoji), and the player has to keep trying.

The game ends when the player matches every pair.

Other rules:

- Green tiles cannot be flipped again. They get disabled. 
- After flipping one tile, the player must flip another one (a *different* one) to continue. 
