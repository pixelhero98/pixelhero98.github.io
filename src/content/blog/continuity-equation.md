---
title: "Understanding the continuity equation"
description: "What changes at a fixed location, what changes along a moving particle, and why velocity divergence controls density."
date: 2026-11-03
tags: ["Generative modelling", "Mathematics"]
draft: true
---

The continuity equation describes how a density changes when particles move under a velocity field. Its material-derivative form separates motion through a nonuniform density from local expansion or compression.

Assume a deterministic flow on Euclidean space,

$$
\frac{dX_t}{dt}=v_t(X_t),
$$

with a sufficiently smooth velocity field and density $\rho_t(x)$. Assume there are no sources or sinks of mass. Conservation of total mass additionally requires suitable boundary conditions, such as vanishing flux at infinity. For a probability density, the conserved total mass is one.

## Start with conservation

For a fixed region $A$, mass changes only through its boundary:

$$
\frac{d}{dt}\int_A\rho_t(x)\,dx
=-\int_{\partial A}\rho_t(x)v_t(x)\cdot n(x)\,dS.
$$

Here $n$ is the outward unit normal. Positive outward flux removes mass from $A$. Applying the divergence theorem gives the local equation

$$
\partial_t\rho_t+\nabla\cdot(\rho_t v_t)=0.
$$

The flux $\rho_t v_t$ combines how much mass is present with how fast it moves. Neither density nor flux is an acceleration.

## Separate transport and compression

Expand the divergence using the product rule:

$$
\underbrace{\partial_t\rho_t}_{\text{change at a fixed location}}
+\underbrace{v_t\cdot\nabla\rho_t}_{\text{transport}}
=\underbrace{-\rho_t\nabla\cdot v_t}_{\text{expansion or compression}}.
$$

The terms describe different measurements:

- $\partial_t\rho_t(x)$ measures the density change at a fixed location $x$.
- $v_t(x)\cdot\nabla\rho_t(x)$ accounts for moving through spatial variation in density.
- $\nabla\cdot v_t(x)$ is the local rate of volume expansion. Positive divergence reduces density along a trajectory; negative divergence increases it.

If position has units of length and time has units of time, divergence has units of inverse time. Consequently, all three terms have units of density per time. Acceleration is instead $\partial_t v+(v\cdot\nabla)v$.

## Follow a moving particle

The chain rule along $X_t$ gives

$$
\frac{d}{dt}\rho_t(X_t)
=\partial_t\rho_t(X_t)+v_t(X_t)\cdot\nabla\rho_t(X_t).
$$

Therefore,

$$
\frac{d}{dt}\rho_t(X_t)
=-\rho_t(X_t)\nabla\cdot v_t(X_t).
$$

This is the material derivative: the density change observed while following the flow. It is a derivative of the density field evaluated along a trajectory, not a statement that an individual particle carries its own probability density.

For a small material volume $V_t$ transported by the flow, its instantaneous relative expansion rate is $\nabla\cdot v_t$. Conservation of mass in that volume explains the sign: increasing volume requires decreasing density.

If divergence is zero, density stays constant along trajectories. It may still change at a fixed location. For example, a constant velocity translates a nonuniform density:

$$
v_t(x)=c,\qquad \rho_t(x)=\rho_0(x-ct).
$$

Here $\nabla\cdot v_t=0$, but $\partial_t\rho_t$ is generally nonzero.

## A Gaussian example

In one dimension, take $v(x)=ax$ with constant $a$ and let $X_0$ have a standard normal distribution. The trajectory and its density are

$$
X_t=e^{at}X_0,\qquad
\rho_t(x)=e^{-at}\rho_0(e^{-at}x).
$$

Thus the standard deviation is $e^{at}$ and the density at the origin is $e^{-at}/\sqrt{2\pi}$. Along a trajectory,

$$
\rho_t(X_t)=e^{-at}\rho_0(X_0),\qquad
\frac{d}{dt}\rho_t(X_t)=-a\rho_t(X_t).
$$

This matches the material-derivative equation because $\partial_xv=a$. Positive $a$ spreads the distribution; negative $a$ contracts it. In both cases, the integral of the density stays one.

The following example checks the analytical density against a numerical integral over a wide interval. It uses only Python's standard library.

```python
from math import exp, pi, sqrt

def density(x, a, t):
    sigma = exp(a * t)
    return exp(-0.5 * (x / sigma) ** 2) / (sqrt(2 * pi) * sigma)

for a in (-0.5, 0.0, 0.5):
    t = 1.0
    sigma = exp(a * t)
    n = 20_000
    left, right = -8 * sigma, 8 * sigma
    dx = (right - left) / n
    mass = sum(density(left + (i + 0.5) * dx, a, t)
               for i in range(n)) * dx
    print(f"a={a:+.1f}, std={sigma:.3f}, "
          f"density(0)={density(0, a, t):.3f}, mass={mass:.6f}")
```

```text
a=-0.5, std=0.607, density(0)=0.658, mass=1.000000
a=+0.0, std=1.000, density(0)=0.399, mass=1.000000
a=+0.5, std=1.649, density(0)=0.242, mass=1.000000
```

The numerical integral is a check of this example, not a general proof of mass conservation.

## Connection to continuous normalizing flows

Where $\rho_t(X_t)>0$, divide by density to obtain

$$
\frac{d}{dt}\log\rho_t(X_t)=-\nabla\cdot v_t(X_t).
$$

Integrating along the trajectory gives

$$
\log\rho_T(X_T)=\log\rho_0(X_0)
-\int_0^T\nabla\cdot v_t(X_t)\,dt.
$$

This is the instantaneous change-of-variables identity used in continuous normalizing flows. The velocity determines the trajectory; its divergence determines the log-density change along that trajectory. The identity does not, by itself, prescribe how to train the velocity field.

For a discrete Euler map $F(x)=x+h v(x)$, the exact density update, when the map is invertible, uses $-\log|\det(I+h\nabla v(x))|$. Replacing this by $-h\nabla\cdot v(x)$ is a first-order approximation, not an exact finite-step identity.

The distinction matters when relating a continuous-time model to a numerical sampler: the differential equation describes the ideal flow, while the implemented update introduces discretization error.
