_**Note:** if this is your first time working with higher-order functions, I highly recommend first reading [Introduction to higher-order functions: getting to know 'filter'](higher-order-part-1.html)._

> **Summary**

> Higher-order functions are a crucial part of the functional programming paradigm. This article continues exploring basic higher-level functions by introducing `map`.

## Background

As we saw in the last article, **higher-order functions** are functions that take other functions as inputs. In this article, we'll talk about another very useful higher-order function called `map`. `map` is very useful for _transforming lists of data according to some helper function_.

## Doubling a list of numbers

Suppose we have a function called `doubler` that takes a number and multiplies it by two.

```scheme
; doubler : Number -> Number
; takes a number and doubles it
(define (doubler n) (* n 2))
```

Now imagine we have the following list of numbers:

```scheme
(list 1 3 0 -2 9)
```

We want to take this list, double each element, and return the newly-doubled list. We *could* go through the list one element at a time, applying `doubler` to each item and adding the result to a new list:

```scheme
(list (doubler 1)
      (doubler 3)
      (doubler 0)
      (doubler -2)
      (doubler 9))
```

…but that’s a lot of work, and we'd have to write this out manually every time we're given a new list. Alternatively, we could write a recursive procedure `list-doubler` to automatically apply `doubler` to each element of any list of numbers:

```scheme
; list-doubler : List-of-Numbers -> List-of-Numbers
; doubles each number in the list
(define (list-doubler lon)
  (cond
    [(empty? lon) empty]
    [else (cons (doubler (first lon))
                (list-doubler (rest lon)))]))
```

Calling `list-doubler` on `(list 1 3 0 -2 9)` produces the following execution:

| **Input List** | **Conditional Step** | **Output Thus Far** |
:---------- | :-------------------------- | :--------------------------- |
| `'(1 3 0 -2 9)` | `(doubler 1) -> 2` | `(cons 2 (...))`
| `'(3 0 -2 9)` | `(doubler 3) -> 6` | `(cons 2 (cons 6 (...)))`
| `'(0 -2 9)` | `(doubler 0) -> 0` | `(cons 2 (cons 6 (cons 0 (...))))`
| `'(-2 9)` | `(doubler -2) -> -4` | `(cons 2 (cons 6 (cons 0 (cons -4 (...)))))`
| `'(9)` | `(doubler 9) -> 18` | `(cons 2 (cons 6 (cons 0 (cons -4 (cons 18 (...))))))`
| `'()` | `(empty? '()) -> empty` | `(cons 2 (cons 6 (cons 0 (cons -4 (cons 18 empty)))))`

So `(list-doubler (list 1 3 0 -2 9))` gives us `(list 2 6 0 -4 18)`, as expected.

## General list transformations

Once again, we can generalize `list-doubler` to work with lists of *any* type, and functions of the same input type. Let's call this newly-generalized function `my-map`.

Just like going from `filter-odd` to `my-filter`, we need to make a few modifications to `list-doubler`:

* `my-map` takes a new input, a function `f` with signature `X -> Y`,
* Instead of a list of numbers `lon`, `my-map` takes a general `lst` of any type,
* Instead of applying `doubler` to the current `lst` item, we apply `f`, and
* We make sure to pass `f` in our recursive call to `my-map`.

Here's the code for `my-map`:

```scheme
; my-map : (X -> Y) List-of-X -> List-of-Y
; applies the provided function to each element of the list
(define (my-map f lst)
  (cond
    [(empty? lst) empty]
    [else (cons (f (first lst))
                (my-map f (rest lst)))]))
```

As we can see, `my-map` walks through the input `lst`, recursively building the output list by applying `f` to each element of `lst`.

### Using the built-in `map` function

Again, this is a lot of work to implement, and you can probably guess what happens next: we save effort by using the built-in `map` function, which works almost exactly like `my-map`.

The following single line of code

```scheme
(map doubler (list 1 3 0 -2 9))
```

returns

```scheme
(list 2 6 0 -4 18)
```

Pretty spicy, right? In fact, `map` works with all data types, not just numbers. Here are a couple of examples.

### Example: using `map` with a list of strings

Consider the following helper function, `append-obama`, which appends "obama" to the end of an input string (very useful for thanking Obama):

```scheme
; append-obama : String -> String
; appends "obama" to the end of a string
(define (append-obama str)
  (string-append str "obama"))
```

Given this helper, suppose we want to produce a list of thank-yous to Obama. We can easily accomplish this using `map`, like so:

```scheme
(map append-obama (list "thanks" "thank you" "thx"))
```
which returns

```scheme
(list "thanksobama" "thank youobama" "thxobama")
```

which is the same thing as

```scheme
(list (append-obama "thanksobama")
      (append-obama "thank youobama")
      (append-obama "thxobama"))
```

but way less work. As Ethan Robison has probably told you one million times, programming is about doing less work. Less work = more thanking Obama = profit.

### Example: using `map` with a list of lists

We can use `map` with functions that take lists, and lists of lists (what a mouthful).

> **Note**

> Recall that the `rest` function takes a list and returns the sub-list of everything after the first value.
> 
> * `(rest (list 1 2 3 4))` returns `(list 2 3 4)`.
> * `(rest (list 1))` returns `'()`, the `empty` list.
>     * Remember, `(list 1)` is just shorthand for `(cons 1 empty)`.

Suppose we have a bunch of lists, and we want to chop the first item off of all of them (bulk decapitation, if you will). We can accomplish this the hard way, by applying `rest` to each list individually:

```scheme
(list (rest (list 1 2))
      (rest (list "first" "second"))
      (rest (list true false)))
```

Alternatively, we can use `map` to perform expedited bulk decapitation! Calling

```scheme
(map rest (list (list 1 2)
                (list "first" "second")
                (list true false)))
```

returns 

```scheme
(list (list 2)
      (list "second")
      (list false))
```

which is equivalent to the lengthy code above.



## Type consistency, and a general signature for `map`

Based on the above examples, we can write the signature for `map` like so:

```scheme
; map : Function List -> List
(map f lst) -> lst
```

In words, `map` takes a function `f` and a list `lst`, applies the function `f` to each element of `lst`, and returns the resulting list of elements transformed by `f`. *Note that `map` is a higher-order function precisely because it takes a function as one of its arguments.*

<div class="flow-chart"><svg height="99" version="1.1" width="231.796875" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="overflow: hidden; position: relative; top: -0.625px;"><desc style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Created with RaphaÃ«l 2.1.2</desc><defs style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><path stroke-linecap="round" d="M5,0 0,2.5 5,5z" id="raphael-marker-block" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path><marker id="raphael-marker-endblock33-obj110" markerHeight="3" markerWidth="3" orient="auto" refX="1.5" refY="1.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#raphael-marker-block" transform="rotate(180 1.5 1.5) scale(0.6,0.6)" stroke-width="1.6667" fill="black" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></use></marker><marker id="raphael-marker-endblock33-obj111" markerHeight="3" markerWidth="3" orient="auto" refX="1.5" refY="1.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#raphael-marker-block" transform="rotate(180 1.5 1.5) scale(0.6,0.6)" stroke-width="1.6667" fill="black" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></use></marker></defs><rect x="0" y="0" width="28.3125" height="93" rx="20" ry="20" fill="#ffffff" stroke="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);" stroke-width="2" class="flowchart" id="st" transform="matrix(1,0,0,1,10.7344,4)"></rect><text x="10" y="46.5" text-anchor="start" font-family="sans-serif" font-size="14px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-family: sans-serif; font-size: 14px; font-weight: normal;" id="stt" class="flowchartt" font-weight="normal" transform="matrix(1,0,0,1,10.7344,4)"><tspan dy="-21.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">a</tspan><tspan dy="18" x="10" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">b</tspan><tspan dy="18" x="10" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">c</tspan><tspan dy="18" x="10" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">d</tspan></text><rect x="0" y="0" width="40.15625" height="39" rx="0" ry="0" fill="#ffffff" stroke="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);" stroke-width="2" class="flowchart" id="op1" transform="matrix(1,0,0,1,93.8594,31)"></rect><text x="10" y="19.5" text-anchor="start" font-family="sans-serif" font-size="14px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-family: sans-serif; font-size: 14px; font-weight: normal;" id="op1t" class="flowchartt" font-weight="normal" transform="matrix(1,0,0,1,93.8594,31)"><tspan dy="5.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">f(x)</tspan><tspan dy="18" x="10" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></tspan></text><rect x="0" y="0" width="41.78125" height="93" rx="20" ry="20" fill="#ffffff" stroke="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);" stroke-width="2" class="flowchart" id="e" transform="matrix(1,0,0,1,188.0156,4)"></rect><text x="10" y="46.5" text-anchor="start" font-family="sans-serif" font-size="14px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-family: sans-serif; font-size: 14px; font-weight: normal;" id="et" class="flowchartt" font-weight="normal" transform="matrix(1,0,0,1,188.0156,4)"><tspan dy="-21.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">f(a)</tspan><tspan dy="18" x="10" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">f(b)</tspan><tspan dy="18" x="10" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">f(c)</tspan><tspan dy="18" x="10" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">f(d)</tspan></text><path fill="none" stroke="#000000" d="M39.046875,50.5C39.046875,50.5,79.38941414654255,50.5,90.85394431416353,50.5" stroke-width="2" marker-end="url(#raphael-marker-endblock33-obj110)" font-family="sans-serif" font-weight="normal" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); font-family: sans-serif; font-weight: normal;"></path><path fill="none" stroke="#000000" d="M134.015625,50.5C134.015625,50.5,173.66972494125366,50.5,185.01606408460066,50.5" stroke-width="2" marker-end="url(#raphael-marker-endblock33-obj111)" font-family="sans-serif" font-weight="normal" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); font-family: sans-serif; font-weight: normal;"></path></svg></div>

We aren't quite done, though -- there's another nitpick to add. Because `map` applies `f` to the elements of the `lst`, we need to be sure that our function `f` *actually accepts inputs of the type stored in `lst`*.

For example, consider the following function `doubled-square`, which takes a number.

```scheme
; doubled-square : Number -> Number
; returns twice the square of a number
(define (doubled-square n)
  (* 2 (sqr n)))
```

Now, the following code *would not* work:

```scheme
(map doubled-square (list "ab" "bc" "cd"))
```

In this case, we've passed `map` a function that takes numbers, and a list of strings! So when `map` tries to apply `doubled-square` to `(list "ab" "bc" "cd)`, we'll get an error, because `doubled-square` doesn't know what to do with `"ab"`.

Sure enough, when we run the code, Racket throws the following error:

```
sqr: expected a number; given "ab"
```

So, we can make our initial definition a little more specific:

```scheme
; map : Function (X -> Y) List-of-X -> List-of-Y
(map f lst) -> lst
```

In other words, `map` takes

1. A function, which takes an input of Type `X` and returns an output of Type `Y`, and
2. A list of elements of Type `X`.

then, since the function returns an output of Type `Y`, `map` will return a list of elements of Type `Y` (the results of calling the function on each element of the original list).

Don't get confused by all the `X`'s and `Y`'s. Think about it intuitively:

1. `map` works by taking a function, call it `f`, and applying it to the elements of `lst`.
2. This is the same thing as repeatedly applying `f` to a single element of `lst`, and stitching all the individual outputs back together into an output list.
3. In order for this to work, the elements of `lst` can be of any type -- strings, booleans, posns, lists of strings -- but whatever type they are, *`f` has to accept inputs of this type*, or else Step 2 would fail. So if our `lst` is a list of posns, but `f` has to accept posns as inputs. If `f` only accepts booleans, then we can't apply `f` to `lst` -- and neither can `map`.

## Using `map` with functions with multiple inputs

Finally, it turns out that `map` is even more powerful: it can take *multiple lists* as inputs for the provided function. Consider the following helper function:

```scheme
; teenager-check : String Number -> String
; check if someone is a teenager and return a message with the result
(define (teenager-check name age)
  (cond
    [(<= age 18) (string-append name " is a teenager")]
    [else (string-append name " is an adult")]))
```

Now, calling

```scheme
(map teenager-check (list "Angelica" "Peggy" "Eliza") 
                    (list 20 16 19))
```

returns

```scheme
(list "Angelica is an adult"
      "Peggy is a teenager"
      "Eliza is an adult")
```

In this example, we pass `map`

1. A function `teenager-check`, which takes (1) a string and (2) a number, in that order,
2. A list of strings `(list "Angelica" "Peggy" "Eliza")`, and
3. A list of numbers `(list 20 16 19)`.

So when `map` is given a function that takes multiple arguments, it pulls the first argument from the first list, the second argument from the second list, and so on. This generalizes to arbitrarily many arguments -- `map` will just grab the _k_-th argument from the _k_-th list.

Consider one final example: using `map` with a function like `max`, which takes an arbitrary number of numbers as inputs, and returns the largest one.

```scheme
(map max (list 1 20 3)
         (list 10 2 30)
         (list 50 4 12))
```

returns

```scheme
(list 50 20 30)
```

and is the equivalent of writing the following code:

```scheme
(list (max 1 10 50)
      (max 20 2 4)
      (max 3 30 12))
```

So to summarize, `map` takes a function `f`, and an arbitrary number of lists corresponding to the number of arguments accepted by `f`. The arguments passed to `f` are pulled from the lists in the order we provide `map`, so it's crucial that we call `map` with our input lists in the exact order as `f`'s arguments. Using `teenager-check` as an example,

```scheme
; teenager-check : String Number -> String
; (teenager-check name age)

; This would NOT work!
(map teenager-check (list 20 16 19)
                    (list "Angelica" "Peggy" "Eliza"))

; Much better=
(map teenager-check (list "Angelica" "Peggy" "Eliza")
                    (list 20 16 19))
```

In the first (wrong) example, `map` would call `teenager-check`, passing a value from the first list (of numbers) for the first argument (`name`, a string), and a value from the second list (of strings) for the second argument (`age`, a number). This fails the type-consistency rule we established above!

The second example reverses the order of the input lists. Now our code works, because the order of the lists corresponds to the order of arguments in the signature of `teenager-check`. That is, the first argument (`name`, a string) will be pulled from the first list (of strings), the second argument (`age`, a number) will be pulled from the second list (of numbers), and all will be well.

## A finalized general signature for `map`

Now that we know `map` takes an arbitrary number of lists, corresponding to the number of inputs of the helper function, we can finally write a complete signature.

Recall our previous signature, which accounted for *type consistency* between `f` and the elements of `lst`:

```scheme
; map : (X -> Y) List-of-X -> List-of-Y
(map f lst) -> lst
```

Our final signature looks something like this:

```scheme
; map : (X ... -> Y) List-of-X ... -> List-of-Y
(map f lst ...) -> lst
```

In words, `map` is a function that takes

1. A function, which takes an arbitrary number *n* of inputs of any type and returns an output of Type `Y`, and
2. Exactly *n* lists, with the type of each list corresponding to the type of the corresponding input of the function.

`map` then returns a single list of Type `Y`, the result of calling the function with its *n* inputs taken, in order, from the *n* lists.

In the above signature, `...` denotes an arbitrary extension of a sequence. For instance, the following would be valid:

```scheme
; map : (X1 X2 X3 -> Y) List-of-X1 List-of-X2 List-of-X3 -> List-of-Y
(map f lst1 lst2 lst3) -> lst
```

## Conclusion

Higher-order functions are a super important feature of programming languages. Using higher-order functions like `map` and `filter`, we can take functions designed to operate on small pieces of data -- an individual number or string, for instance -- and apply these functions to arbitrarily large quantities of data, such as lists of numbers and lists of strings.

------------------

_This article was written by [Sarah Lim](http://sarahlim.com) for the students in EECS 111 at Northwestern University. If you have any questions about higher-order functions or introductory programming in general, feel free to email **slim [at] u.northwestern [dot] edu**._