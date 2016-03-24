> **Summary**

> Higher-order functions are a crucial part of the functional programming paradigm. This article introduces `filter`, a simple but super-useful higher-order function.

## Background
We’ve worked heavily with functions in this course. Just to recap what we’ve seen so far, a **function**  in Racket works very similarly to a function in math: it takes some inputs (also called **parameters** or **arguments**), plugs them into the **body expression**, and simplifies the body expression down to some output (also called a **return value**).

Formally, we have function **definitions**, which look like
```scheme
(define (FunctionName InputName)
  BodyExpression)
```
where the `define` keyword tells Racket, “`FunctionName` is a function that takes an input called `InputName`, and evaluates `BodyExpression`.”

Likewise, we have function **applications** (also called **function calls**), which look like
```scheme
(FunctionName InputExpression)
```
which tells Racket, “Run the function called `FunctionName` with `InputExpression` as the input.”

> **Note**

> The above examples describe a function that only takes one input/argument/parameter, but can be generalized to functions receiving multiple inputs/arguments/parameters.

## Higher-order functions

So far, we’ve worked with functions that take numbers, strings, and other types of data as inputs. Now, let’s look at a new input type: *other functions*.

Functions that take functions as inputs are called **higher-order functions**. Think about regular functions: they take data, such as numbers or strings, and process it into different data. “Higher-order” is just a fancy way of saying that a function can take *other functions* and process them into different data — this function is of a “higher order” than its lowly peers, capable only of transforming basic data types.

> **Note**

> Technically, a **higher-order function** is a function that does _one or more_ of the following:
> 
> * Take one or more functions as arguments
> * Return a function as its result
> 
> For the purposes of this section, you’ll only need to know about higher-order functions of the first type.

Extending the relationship between functions in Racket and math, you’ve probably taken the derivative of a polynomial at some point. Suppose we have a function of the form

$$f(x) = 3x^3 - x^2 + 4x + 8$$

and we take its derivative, using the power rule:

$$
\begin{align}
\frac{d}{dx}(f(x)) &= \frac{d}{dx}(3x^3 - x^2 + 4x + 8) \\\\
                   &= 9x^2 - 2x + 4
\end{align}
$$

In this case, the differentiation operator can be considered a **higher-order function**. It _takes a function_, our third-degree polynomial $f(x)$, and returns another function, a second-degree polynomial $f’(x)$.

So how does this relate to Racket? It turns out that higher-order functions are very powerful tools for working with more complex data types, such as lists. Let’s examine two higher-order functions for working with lists.

## Filtering lists according to some criteria with `filter`

The first higher-order function we'll use is called `filter`, and it's useful for _filtering elements of a list according to some custom criteria_. `filter` is higher-order because it allows you to specify this custom criteria by passing in a "helper function" -- but more on that in a bit.

> **Note**

> Throughout this article, we'll be talking about higher-order functions that accept other functions as inputs. To avoid confusion, we will use the term **"helper function"** to denote the function being passed as an input to the higher-order function.
> 
> In general, the term "helper function" denotes a function designed to accomplish some sub-task of the "main" function.

First, we'll take a detour to discuss another kind of function: predicates.

### Predicates

Suppose we're given a random integer, and we want to determine whether this number is odd or even.

We can do this using the `odd?` function built into Racket. The `odd?` function takes a number and _returns a boolean_ indicating whether the provided number is odd. For instance, `(odd? 35)` returns `#true`, and `(odd? 2)` returns `#false`.

Functions like `odd?` are called **predicates**. A **predicate** is a function that takes some input and returns boolean -- either `#true` or `#false`.

Here are some other examples of predicates:

* `even?` takes a number and returns true if the number is even, false otherwise
* `number?` takes a value and returns true if the value is a number, false otherwise
* `string=?` takes two strings and returns true if the strings are equal, false otherwise
* `eq?` takes two values and returns true if the values are equal, false otherwise.

So we can think of predicates as "answering a question," based on some conditional value (the input). Consequently, Racket programmers denote a predicate with a question mark (`?`) at the end of the function name.

A predicate has the following signature:

```scheme
my-predicate? : X ... -> Boolean
```

* `my-predicate?` says that a predicate's name has a question mark at the end (it can obviously be named something else)
* `X ...` says that a predicate can take any number of values, of any type
* `Boolean` says that the predicate will always return a boolean value (`#true` or `#false`).

In this section, we'll be working with predicates that take exactly *one input*. Such predicates have the following signature:

```scheme
my-predicate? : X -> Boolean
```

So `odd?`, `even?`, and `number?` are predicates that take one input, whereas `string=?` and `eq?` are predicates that take two inputs.

> **Note**

> You don't need to know this for EECS 111, but predicates of a single input are called **unary predicates**, with "unary" meaning "one." Like much of computer science, the vocabulary makes concepts seem more complex than they are -- for instance, you're probably familiar with the term "binary," which means "two."

Now that we know what predicates are, we can talk about `filter`.

### Filtering odd numbers

Suppose we have the following list of numbers:

```scheme
(list 1 2 4 5)
```

and we want to get all the odd numbers from this list. In other words, we want to *filter the list to keep the odd numbers*.

We know that the `odd?` predicate tells us whether one number is odd, but how do we scale this to work with lists? We could write a recursive function to handle this:

```scheme
; filter-odd : List-of-Numbers -> List-of-Numbers
; filters the list to keep only odd numbers
(define (filter-odd lon)
  (cond
    [(empty? lon) empty]
    ; If the current element is odd, keep it and continue
    [(odd? (first lon))      (cons (first lon)
                                   (filter-odd (rest lon)))]
    ; Otherwise, discard the element and continue
    [else                    (filter-odd (rest lon))]))
```

Now, calling `(filter-odd (list 1 2 4 5))` produces the following execution.

> **Note**

> For purposes of clarity, in the "Input `lon`" column I use quote syntax `'()` for lists.
> For instance, I will write `(list 1 2 3)` as `'(1 2 3)`.

| **Input list** | **Conditional step** | **Recursive call, thus far** |
-----------------|--------------------------|----------------------------|
| `'(1 2 4 5)` | `(odd? 1) -> true` | `(cons 1 (...))` |
| `'(2 4 5)`     | `(odd? 2) -> false` | `(cons 1 (...))` |
| `'(4 5)`    | `(odd? 4) -> false` | `(cons 1 (...))` |
| `'(5)`     | `(odd? 5) -> true` | `(cons 1 (cons 5 (...)))` |
| `'()`     | `(empty? '()) -> empty` | `(cons 1 (cons 5 empty))` |

So calling `(filter-odd (list 1 2 4 5))` returns `(list 1 5)`, as expected!

### Filtering with any predicate

It turns out that we can easily generalize `filter-odd` to work with *any predicate*, not just `odd?`.

The following function `my-filter` is extremely similar to `filter-odd`, with a few minor modifications:

1. It takes a new input, a predicate called `p?` with signature `X -> Boolean`,
2. We've changed the `lon` to `lst`, to denote that the input can be a list of any value,
2. Instead of calling `odd?` in the second conditional case, we call `p?`, and
3. We make sure to pass `p?` along in the recursive calls.

Here's the code for `my-filter`:

```scheme
; my-filter : (X -> Boolean) List-of-X -> List-of-X
; filters the list according to some predicate
(define (my-filter p? lst)
  (cond
    [(empty? lst) empty]
    [(p? (first lst))      (cons (first lst)
                                 (my-filter p? (rest lst)))]
    [else                  (my-filter p? (rest lst))]))
```

So now we have a function that accepts a custom predicate `p?` and a list of values `lst`, and returns a new list containing all of the elements of `lst` for which `p?` returned `#true`. This means we can filter any list we'd like, using a custom predicate that normally only works on a single list item!

### The built-in `filter` function

`my-filter` is a useful helper function with broad applications, but wouldn't it be better if we didn't have to write out a recursive procedure every time we started writing a new Racket program?

It turns out we don't, because `filter` is built into Racket's Intermediate Student Language already. It works exactly the same way as `my-filter`:

* `(filter odd? (list -1 0 2 3 25))` returns `(list -1 3 25)`,
* `(filter number? (list 1 "ian" true 0))` returns `(list 1 0)`.

`filter` has the following signature:

```scheme
; filter : (X -> Boolean) List-of-X -> List-of-X
; returns a list containing all values X for which the predicate is true
```

Here's one thing to note: the `X`'s in the above signature define something very important. Namely, since `filter` works by applying the predicate to each item of the list, *the predicate's input type must match the list items' type*.

For instance, the following code would NOT work:

```scheme
(filter odd? (list "these" "are" "strings"))
```

because `filter` will call `(odd? "these")`, and the `odd?` function isn't designed to work with strings.

Recall that a function is a **higher-order function** if it takes a function as an argument. In this case, `filter` takes a predicate function as an argument, so `filter` is higher-order!

In the next article, we'll examine a slightly more general higher-order function, `map`: [Higher-order functions, continued: 'map'](higher-order-part-2.html)

------------------

_This article was written by [Sarah Lim](http://sarahlim.com) for the students in EECS 111 at Northwestern University. If you have any questions about higher-order functions or introductory programming in general, feel free to email **slim [at] u.northwestern [dot] edu**._