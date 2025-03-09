# FM Formula Sheet
*Updated 09/27/24*

## Interest Measurement

### Effective Rate of Interest
$$i_t = \frac{A(t) - A(t - 1)}{A(t - 1)}$$

### Effective Rate of Discount
$$d_t = \frac{A(t) - A(t - 1)}{A(t)}$$

### Accumulation Function and Amount Function
$$A(t) = A(0) \cdot a(t)$$

### All-in-One Relationship Formula
$$(1 + i)^t = \left(1 + \frac{i^{(m)}}{m}\right)^{mt} = (1 - d)^{-t} = \left(1 - \frac{d^{(m)}}{m}\right)^{-mt} = e^{\delta t}$$

### Simple Interest
$$a(t) = 1 + it$$

### Variable Force of Interest
$$\delta_t = \frac{a'(t)}{a(t)}$$

Accumulate 1 from time $t_1$ to time $t_2$:
$$AV = \exp\left(\int_{t_1}^{t_2} \delta_u du\right)$$

### Discount Factor
$$v = \frac{1}{1 + i} = 1 - d$$
$$d = \frac{i}{1 + i} = iv$$

### Inflation & the Real Interest Rate
$$i_{real} = \frac{1 + i}{1 + \pi} - 1$$
$$i = (1 + i_{real})(1 + \pi) - 1$$

## Annuities

### Annuity-Immediate
$$PV = a_{n|}$$
$$= v + v^2 + \ldots + v^n$$
$$= \frac{1 - v^n}{i}$$

$$AV = s_{n|}$$
$$= 1 + (1 + i) + \ldots + (1 + i)^{n-1}$$
$$= \frac{(1 + i)^n - 1}{i}$$

### Annuity-Due
$$PV = \ddot{a}_{n|}$$
$$= 1 + v + v^2 + \ldots + v^{n-1}$$
$$= \frac{1 - v^n}{d}$$

$$AV = \ddot{s}_{n|}$$
$$= (1 + i) + (1 + i)^2 + \ldots + (1 + i)^n$$
$$= \frac{(1 + i)^n - 1}{d}$$

### Immediate vs. Due
$$\ddot{a}_{n|} = a_{n|}(1 + i) = 1 + a_{n-1|}$$
$$\ddot{s}_{n|} = s_{n|}(1 + i) = s_{n+1|} - 1$$

### Deferred Annuity
m-year deferred n-year annuity-immediate:
$$PV = {}_m|a_{n|} = v^m \cdot a_{n|} = a_{m+n|} - a_{m|}$$

### Perpetuity
* Perpetuity-immediate:
$$PV = a_{\infty|} = v + v^2 + \ldots = \frac{1}{i}$$

* Perpetuity-due:
$$PV = \ddot{a}_{\infty|} = 1 + v + v^2 + \ldots = \frac{1}{d}$$
$$\ddot{a}_{\infty|} = 1 + a_{\infty|}$$

## More General Annuities

*j-effective method is used when payments are more or less frequent than the interest period.*

### "j-effective" Method
Convert the given interest rate to the equivalent effective interest rate for the period between each payment.

Example: To find the present value of n monthly payments given annual effective rate of i, define j as the monthly effective rate where $j = (1 + i)^{1/12} - 1$. 
Then apply $PV = a_{n|}$ using j.

### Payments in Arithmetic Progression
* PV of n-year annuity-immediate with payments of 
$$P, P + Q, P + 2Q, \ldots, P + (n - 1)Q$$
$$PV = Pa_{n|} + Q\left[\frac{a_{n|} - nv^n}{i}\right]$$

Calculator-friendly version:
$$PV = \left(P + \frac{Q}{i}\right)a_{n|} + \left(-\frac{Qn}{i}\right)v^n$$
$$N = n, I/Y = i \text{ (in \%)}, PMT = P + \frac{Q}{i}, FV = -\frac{Qn}{i}$$

* PV of n-year annuity-immediate with payments of $1, 2, 3, \ldots, n$
$$\text{Unit increasing: } (I a)_{n|} = \frac{\ddot{a}_{n|} - nv^n}{i}$$
P&Q version: $P = 1, Q = 1, N = n$

* PV of n-year annuity-immediate with payments of $n, n - 1, n - 2, \ldots, 1$
$$\text{Unit decreasing: } (Da)_{n|} = \frac{n - a_{n|}}{i}$$
P&Q version: $P = n, Q = -1, N = n$

* PV of perpetuity-immediate and perpetuity-due with payments of $1, 2, 3, \ldots$
$$(Ia)_{\infty|} = \frac{1}{i^2} = \frac{1}{i} + \frac{1}{i^2}$$
$$(I\ddot{a})_{\infty|} = \frac{1}{d^2}$$

### Payments in Geometric Progression
PV of an n-year annuity-immediate with payments of 
$$1, (1 + k), (1 + k)^2, \ldots, (1 + k)^{n-1}$$
$$PV = \frac{1 - \left(\frac{1 + k}{1 + i}\right)^n}{i - k}, i \neq k$$

### Level and Increasing Continuous Annuity
$$\bar{a}_{n|} = \int_0^n v^t dt = \frac{1 - v^n}{\delta} = \frac{i}{\delta}a_{n|}$$
$$(I\bar{a})_{n|} = \int_0^n tv^t dt = \frac{\bar{a}_{n|} - nv^n}{\delta}$$

## Yield Rates

Two methods for comparing investments:
* Net Present Value (NPV): Sum the present value of cash inflows and cash outflows. Choose investment with greatest positive NPV.
* Internal Rate of Return (IRR): The rate such that the present value of cash inflows is equal to the present value of cash outflows. Choose investment with greatest IRR.

## Loans

### Outstanding Balance Calculation
* Prospective: $B_t = Ra_{n-t|}$
  Present value of future level payments of R.

* Retrospective: $B_t = L(1 + i)^t - Rs_{t|}$
  Accumulated value of original loan amount L minus accumulated value of all past payments.

### Loan Amortization
For a loan of $a_{n|}$ repaid with n payments of 1:

| | Period t |
|---|---|
| Interest $(I_t)$ | $1 - v^{n-t+1}$ |
| Principal repaid $(P_t)$ | $v^{n-t+1}$ |
| Total | 1 |

### General Formulas for Amortized Loan with Level/Non-Level Payments
$$I_t = i \cdot B_{t-1}$$
$$B_t = B_{t-1}(1 + i) - R_t = B_{t-1} - P_t$$
$$P_t = R_t - I_t$$
$$P_{t+k} = P_t(1 + i)^k \text{ (only for Level Payments)}$$

## Bonds

### Bond Pricing Formulas
* P = Price of bond
* F = Par value (face amount) of bond (not a cash flow)
* r = Coupon rate per payment period
* Fr = Amount of each coupon payment
* C = Redemption value of bond (F = C unless otherwise stated)
* i = Interest rate per payment period
* n = Number of coupon payments

### Basic Formula
$$P = Fra_{n|}^i + Cv^n$$

### Premium/Discount Formula:
$$P = C + (Fr - C)a_{n|}^i$$

### Premium vs. Discount

| | Premium | Discount |
|---|---|---|
| Condition | $P > C$ or $Fr > Ci$ | $P < C$ or $Fr < Ci$ |
| Amortization Process | Write-Down | Write-Up |
| Amount | $\|(Fr - Ci) \cdot v^{n-t+1}\| = \|B_{t-1} - B_t\| = \|Fr - I_t\|$ |

### General Formulas for Bond Amortization
* Book value:
$$B_t = Fra_{n-t|}^i + Cv^{n-t} = C + (Fr - C)a_{n-t|}^i$$

* Interest earned = $iB_{t-1}$

### Callable Bonds
Calculate the lowest price for all possible redemption dates at a certain yield rate. This is the highest price that guarantees this yield rate.

* Premium bond – call the bond on the FIRST possible date.
* Discount bond – call the bond on the LAST possible date.

## Spot Rates and Forward Rates

$s_t$ is the t-year spot rate.
$f_{[t_1,t_2]}$ is the forward rate from time $t_1$ to time $t_2$, expressed annually.

$$(1 + s_n)^n \cdot (1 + f_{[n,n+m]})^m = (1 + s_{n+m})^{n+m}$$
$$(1 + s_n)^n = (1 + f_{[0,1]}) \cdot (1 + f_{[1,2]}) \cdots (1 + f_{[n-1,n]})$$

## Duration and Convexity

### Duration
$$MacD = -\frac{P'(\delta)}{P(\delta)} = \frac{\sum_{t=0}^n t \cdot v^t \cdot CF_t}{\sum_{t=0}^n v^t \cdot CF_t}$$

$$ModD = -\frac{P'(i)}{P(i)} = \frac{\sum_{t=0}^n t \cdot v^{t+1} \cdot CF_t}{\sum_{t=0}^n v^t \cdot CF_t}$$

$$ModD = MacD \cdot v$$

| | $MacD$ |
|---|---|
| n-year zero-coupon bond | n |
| Geometrically increasing perpetuity | $\frac{1 + i}{i - k}$ |
| n-year par bond | $\ddot{a}_{n|}$ |

### First-order Modified Approximation
$$P(i_n) \approx P(i_o) \cdot [1 - (i_n - i_o)(ModD)]$$

### First-order Macaulay Approximation
$$P(i_n) \approx P(i_o) \cdot \left(\frac{1 + i_o}{1 + i_n}\right)^{MacD}$$

### Passage of Time
Given that the future cash flows are the same at time $t_1$ and time $t_2$:
$$MacD_{t_1} = MacD_{t_2} - (t_2 - t_1)$$
$$ModD_{t_1} = ModD_{t_2} - v(t_2 - t_1)$$

### Duration of a portfolio
For a portfolio of m securities where invested amount $P = P_1 + P_2 + \cdots + P_m$ at time 0:
$$MacD_P = \frac{P_1}{P}MacD_1 + \cdots + \frac{P_m}{P}MacD_m$$

### Convexity
$$ModC = \frac{P''(i)}{P(i)} = \frac{\sum_{t=0}^n t \cdot (t + 1) \cdot v^{t+2} \cdot CF_t}{\sum_{t=0}^n v^t \cdot CF_t}$$

$$MacC = \frac{P''(\delta)}{P(\delta)} = \frac{\sum_{t=0}^n t^2 \cdot v^t \cdot CF_t}{\sum_{t=0}^n v^t \cdot CF_t}$$

$$ModC = v^2(MacC + MacD)$$

$$MacC(n\text{-year zero-coupon bond}) = n^2$$

## Immunization

### Redington and Full Immunization

| | Redington | Full |
|---|---|---|
| | $PV_{Assets} = PV_{Liabilities}$ | |
| | $MacD_A = MacD_L \text{ or } P'_A = P'_L$ | |
| | $C_A > C_L$ or $P''_A > P''_L$ | There has to be asset cash flows before and after each liability cash flow. |
| | Immunizes against small changes in i | Immunizes against any changes in i |

### Immunization Shortcut
(works for immunization questions that have asset cash flows before and after the liability cash flow)

1. Identify the asset allocation at the time the liability occurs by equating face amounts (prices) and durations.
$$w = \frac{t_2 - t_L}{t_2 - t_1}$$

| | |
|---|---|
| $t_1$ | Shorter bond duration |
| $t_2$ | Longer bond duration |
| $t_L$ | Liability duration |
| $w$ | Shorter bond's weight |
| $1 - w$ | Longer bond's weight |

2. Adjust for interest to the asset maturity date.

## BA-II Plus Calculator Guideline

### Basic Operations
* ENTER (SET): Send value to a variable (option)
* ↑ ↓: Navigate through variables
* 2ND: Access secondary functions (yellow)
* STO + 0~9: Send on-screen value into memory
* RCL + 0~9: Recall value from a memory

### Time Value of Money (TVM)
Good for handling annuities, loans and bonds.
Note: Be careful with signs of cash flows.

* N: Number of periods
* I/Y: Effective interest rate per period (in %)
* PV: Present value
* PMT: Amount of each payment of an annuity
* FV: Future value
* CPT + (one of above): Solve for unknown
* 2ND + BGN, 2ND + SET, 2ND + QUIT: Switch between annuity immediate and annuity due
* 2ND + P/Y: Please keep P/Y and C/Y as 1
* 2ND + CLR TVM: Clear TVM worksheet
* 2ND + AMORT: Amortization (See Below)

For bonds $P = Fra_{n|}^i + Cv^n$:
N = n; I/Y = i; PV = -P; PMT = Fr; FV = C.

### Cash Flow Worksheet (CF, NPV, IRR)
Good for non-level series of payments.

Input (CF)
* CF0: Cash flow at time 0
* Cn: nth cash flow
* Fn: Frequency of the cash flow

Output (NPV, IRR)
* I: Effective interest rate (in %)
* NPV + CPT: Solve for net present value
* IRR + CPT: Solve for internal rate of return

### Amortization Schedule (2ND + AMORT)
Good for finding outstanding balance of the loan and interest/principal portion of certain payments.
Note: BA-II Plus requires computing the unknown TVM variable before entering into AMORT function.

* P1: Starting period
* P2: Ending period
* BAL: Remaining balance of the loan after P2
* PRN: Sum of the principal repaid from P1 to P2
* INT: Sum of the interest paid from P1 to P2
