# Actuarial Formula Reference

## Present Value Factors

### Present Value of a Single Payment
$v^n = (1+i)^{-n}$

### Present Value of an Immediate Annuity (Ordinary Annuity)
$a_{\overline{n}|} = \frac{1 - v^n}{i}$

### Present Value of an Annuity Due
$\ddot{a}_{\overline{n}|} = \frac{1 - v^n}{d} = \frac{1 - v^n}{i} \cdot \frac{i}{d} = a_{\overline{n}|} \cdot \frac{i}{d} = a_{\overline{n}|} \cdot (1+i)$

### Present Value of a Perpetuity (Immediate)
$a_{\overline{\infty}|} = \frac{1}{i}$

### Present Value of a Perpetuity Due
$\ddot{a}_{\overline{\infty}|} = \frac{1}{d} = \frac{1+i}{i}$

### Present Value of an Increasing Annuity (Immediate)
$(Ia)_{\overline{n}|} = \frac{a_{\overline{n}|} - nv^n}{i} = \frac{1 - v^n - niv^n}{i^2}$

### Present Value of an Increasing Annuity Due
$(I\ddot{a})_{\overline{n}|} = \frac{\ddot{a}_{\overline{n}|} - nv^n}{d} = \frac{1 - v^n - ndv^n}{id}$

### Present Value of an Increasing Perpetuity (Immediate)
$(Ia)_{\overline{\infty}|} = \frac{1}{i^2}$

### Present Value of an Increasing Perpetuity Due
$(I\ddot{a})_{\overline{\infty}|} = \frac{1}{id}$

### Present Value of a Decreasing Annuity (Immediate)
$(Da)_{\overline{n}|} = \frac{n - a_{\overline{n}|}}{i} = \frac{n - \frac{1-v^n}{i}}{i} = \frac{ni - (1-v^n)}{i^2}$

### Present Value of a Decreasing Annuity Due
$(D\ddot{a})_{\overline{n}|} = \frac{n - \ddot{a}_{\overline{n}|}}{d}$

## Accumulation Factors

### Future Value of a Single Payment
$(1+i)^n$

### Future Value of an Immediate Annuity (Ordinary Annuity)
$s_{\overline{n}|} = \frac{(1+i)^n - 1}{i}$

### Future Value of an Annuity Due
$\ddot{s}_{\overline{n}|} = (1+i) \cdot s_{\overline{n}|} = \frac{(1+i)^{n+1} - (1+i)}{i}$

### Future Value of an Increasing Annuity (Immediate)
$(Is)_{\overline{n}|} = \frac{s_{\overline{n}|} - n}{i} = \frac{(1+i)^n - 1 - ni}{i^2}$

### Future Value of an Increasing Annuity Due
$(I\ddot{s})_{\overline{n}|} = (1+i) \cdot (Is)_{\overline{n}|}$

## Definitions

- $i$ = effective interest rate per period
- $d$ = effective discount rate per period = $\frac{i}{1+i}$
- $v$ = discount factor = $\frac{1}{1+i}$
- $n$ = number of periods

## Conversion Formulas

### Nominal to Effective Interest Rate
$i = (1 + \frac{i^{(m)}}{m})^m - 1$

where $i^{(m)}$ is the nominal annual interest rate convertible $m$ times per year.

### Effective to Nominal Interest Rate
$i^{(m)} = m[(1+i)^{1/m} - 1]$

## Force of Interest
$\delta = \ln(1+i)$

$i = e^{\delta} - 1$