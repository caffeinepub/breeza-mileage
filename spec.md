# Specification

## Summary
**Goal:** Capture total fuel cost for each fill-up so the app can derive and show “Price per liter” in fill-up history.

**Planned changes:**
- Extend the backend FillUp model to store an optional numeric “total cost” value per fill-up, and update `addFillUp` to accept and persist it.
- Ensure older fill-ups without cost remain readable, with safe handling of missing values.
- Update the “Record Fill-Up” form to include a numeric “Total cost” input (English), validate as non-negative, and submit it with existing fill-up data.
- Update the Fill-Up History list to compute and display “Price per liter” as (totalCost / liters) when cost is present, with readable decimal formatting and a graceful fallback (e.g., “N/A” or hidden) when missing.

**User-visible outcome:** Users can enter a total cost when recording a fill-up, and later see “Price per liter” for fill-ups that have cost recorded, without breaking older entries.
