# WatchStop - Shopping Cart Technical Test

Shopping cart demo built with HTML, CSS and vanilla JavaScript.

Live demo: https://lukeprosser.github.io/shopping-cart-tech-test/

## Brief

This project is designed to meet the following criteria:

* Add items
* Remove items
* Clear items
* Calculate totals
* Print itemised receipt
* Apply discount codes (each discount code can only be applied once)

## Features

* Clear all or individual cart items.
* Quantity update.
* Modal dialogue displaying dynamic messages (e.g. empty cart, purchase complete, discount feedback etc.).
* Print receipt button displayed within modal upon purchase.
* Discount codes tracked using localStorage.
* Purchase state tracked using localStorage.
* Prevent duplicate items being added to cart.
* Dynamic empty cart message.

## Discount codes

The following discount codes can be used:

* CODE10
* CODE20
* CODE30
* CODE40
* CODE50
* CODE60
* CODE70
* CODE80

Each discount code corresponds to a discount percentage, which will be automatically removed from the cart total.

Discount codes can be reset by clearing localStorage.