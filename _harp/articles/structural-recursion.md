> **Summary**

> When we design programs, the structure of our data usually determines how we approach problems. Structural recursion, which operates on the fields of structured data, is a classic example of this paradigm. This article explains structural recursion in depth, to establish a base for comparing different forms of recursion later on.

Structural recursion is the simplest form of recursion, and the first version you learn in 111. In structural recursion, we decompose problems into identical smaller problems by decomposing **structured data inputs** into identical smaller data inputs. We perform this decomposition by breaking the input data up according to its structural components.

This is still pretty nebulous, so let's look at an example. The function below follows a familiar structural recursive design pattern to compute the sum of a list of numbers.

```scheme
; sum-list-structural : List-of-Numbers -> Number
; returns the sum of a list of numbers
(define (sum-list-structural lon)
  (cond
    [(empty? lon) 0]
    [else (+ (first lon)
             (sum-list-structural (rest lon)))]))
```

We are specifically interested in the **recursive call** for this function. `sum-list-structural` takes one argument, a list of numbers. Our recursive call looks like this:

```scheme
(sum-list-structural (rest lon))
```

In other words, we "pare down" the problem by taking the `rest` of the initial list of numbers -- i.e. everything except the `first` element. Returning to our definition of structural recursion, we have decomposed the problem ("compute the sum of a list of numbers") by decomposing the structured input data (a list of numbers) into its structural components (the `first` and `rest` of a list).

## Structural recursion depends on structured data types

Observe that we *could not decompose the input data without these structural components* (and their corresponding accessor functions). This brings us to a super important concept: **recursive approaches are closely linked with the types of data we're working with**. A stack of Legos is easy to break into identical smaller pieces (just snap off one brick at a time), but a similarly-shaped log of Play-Doh offers no such luxury.

Indeed, structural recursion works for list processing because of Racket's definition of the list data type:

```scheme
; A List-of-Numbers is one of:
; - empty
; - (cons Number List-of-Numbers)

; A List-of-N is one of:
; - empty
; - (cons N List-of-N)
```

where `N` in the second example can refer to any other data type, such as `String`, `Boolean`, or even `List-of-N` again.

In a way, the recursive definition of a list structure mirrors the format of a function written using structural recursion:

```scheme
; A List-of-Numbers is one of:
; - empty  ; base case
; - (cons Number List-of-Numbers)  ; recursive call
```

The branching format of our `cond` statement in `sum-list-structural` follows this exact format.

`lon` is one of:

* `empty`, in which case we are done, or
* two components, a `Number` and a sub-`List-of-Numbers`, in which case we process the `Number` (accessed using `(first lon)`) and **recursively call our function on the sub-`List-of-Numbers`** (accessed using `(rest lon)`).

So the defining characteristic of structural recursion is that in our recursive call, **all the inputs are "fields," or subcomponents, of the original inputs.** `(rest lon)` is a strictly smaller component of the original `lon`, and moreover follows directly from the definition of a `List-of-Numbers`.

### Example: Structural recursion with binary trees

Let's consider another example of structural recursion, this time using binary trees (the classic example of a recursive data type).

```scheme
; A Binary-Tree is one of:
; - empty
; - (make-binary-node Number Binary-Node Binary-Node)
(define-struct binary-node (val left right))
```

> **Note**

> If you're confused about the distinction between binary *nodes* and binary *trees* (hint: there isn't really one), read [this article](binary-nodes.html).

The following function, `sum-tree-structural`, computes the sum of all the nodes in a binary tree:

```scheme
; sum-tree-structural : Binary-Node -> Number
; compute the sum of all the nodes in a binary tree
(define (sum-tree-structural root)
  (cond
    [(empty? root) 0]
    [else (+ (node-val root)
             (sum-tree-structural (node-left root))
             (sum-tree-structural (node-right root)))]))
```

Again, we are interested in the recursive calls. This particular function has two, one for each descendant tree of the current node.

```scheme
(sum-tree-structural (node-left root))
(sum-tree-structural (node-right root))
```

Just as we saw in the list example, our recursive calls operate on *subcomponents* of the original `Binary-Node` input -- the `left` and `right` descendants/subtrees. And once again, this subdivision follows directly from the data definition of a `Binary-Node`:

```scheme
; (make-binary-node Number Binary-Node Binary-Node)
(define-struct binary-node val left right)
```

We know from this definition that a non-empty `root` node consists of three components: a `Number`, and two sub-`Binary-Nodes`. So we process the `Number` (accessed using `(node-val root)`) and **recursively call our function on the sub-`Binary-Node`s** (accessed using `(node-left root)` and `(node-right root)`).

As with lists, when we work with binary trees (and trees more generally), the logic of structural recursion follows **directly from the recursive data type definition**.

To summarize, with structural recursion, our recursive calls operate on defined subcomponents of the input data structures. Put another way, the recursive call takes *smaller versions of the original inputs* as arguments.

## Paring Down

Exactly how much smaller? If we look at the data type definition for whatever structure we are given, the recursive part of the definition **"glues" some value (e.g. a number) to a pre-existing instance of the overall type (e.g. a list of numbers)** to produce a new, larger instance of that type. The **"gluing" operation** varies:

* We might `cons` a `Number` onto a pre-existing `List-of-Numbers` to produce a new `List-of-Numbers`
* We might use `make-binary-node`,  denoting some `Number` the parent of two pre-existing `Binary-Node` subtrees, to produce a new `Binary-Node`.

When we apply structural recursion to lists or binary nodes, our recursive call "pares down" the original input by **undoing one "gluing" operation**.

* Calling `(rest lon)` gives us the sub-list of the original `lon`. If

    * `cons` glues a `Number` to a `List-of-Numbers`, and
    * `rest` retrieves only that `List-of-Numbers`,

  then `rest` effectively "undoes" the `cons` gluing operation.

* Calling `(node-left root)` and `(node-right root)` gives us both subtrees of the original `root` node. If

    * `make-binary-node` glues a `Number` to two `Binary-Nodes`, and
    * `node-left` and `node-right` retrieves only those two `Binary-Node` subtrees,

  then `node-left` and `node-right` effectively "undo" the `make-binary-node` gluing operation.

Hopefully this provides more insight into the definition offered in the previous section:

> The defining characteristic of structural recursion is that in our recursive call, **all the inputs are "fields," or subcomponents, of the original inputs.**

### Advanced: Structural recursion on the natural numbers

Let's consider one final, trickier example of structural recursion: *structural recursion on the natural numbers*.

You are probably familiar with the natural numbers. They're most frequently encountered as/described with the following:

* non-negative integers
* "counting numbers"
* $\mathbb{N}$
*  0, 1, 2, ...

It turns out that we can apply structural recursion to the natural numbers. As with lists and trees, this means the natural numbers have some formal definition that allows us to decompose them into smaller, clearly-defined components.

It turns out that such a definition *does* exist. Without going into the [gory details](https://en.wikipedia.org/wiki/Natural_number#Modern_definitions) (which I am also, like, grossly unqualified to discuss), we can define the natural numbers (hereafter referred to as `Numbers` for simplicity's sake) as follows:

```scheme
; A Number is one of:
; - 0
; - (+ 1 Number)
```

This definition is clearly analogous to the definitions of `Lists-of-Numbers` and `Binary-Nodes`, so I won't flog that horse carcass. Let's look at an example of a structurally recursive function that operates on `Numbers`: the factorial function.

Mathematically, factorial is defined as follows:

$$ \begin{align}
  0! &= 1 \\\\
  n! &= n * (n - 1)!
\end{align} $$

Let's implement the factorial function in Racket:

```scheme
; factorial : Number -> Number
; returns n! for some n
(define (factorial n)
  (cond
    [(eq? n 0) 1]
    [else (* n (factorial (- n 1)))]))
```

Again, look at the recursive call:

```scheme
(factorial (- n 1))
```

Just as with `sum-list`, we "pare down" the problem by taking the `rest` of the initial number -- in this case, we *subtract 1 from n*. So we have decomposed the problem ("calculate $n!$ for some $n$") by decomposing the structured input (according to the above definition of a `Number`) into its components (`1` and `n - 1`).

Now, you might be thinking, "This makes sense from a formal standpoint, but I feel like this 'decomposition' of a `Number` is getting into jank/arbitrary territory." And you're right. Structural recursion operates on data with concrete sub-parts, and in our case, numbers only have sub-parts _because we said so_, i.e. because we've adopted a definition of `Numbers` that subdivides `6` into `1` and `5`.

Which brings us to another big-picture point: the distinction between structural recursion and generative recursion (which we'll discuss soon). This classification comes from the authors of [How to Design Programs](http://www.ccs.neu.edu/home/matthias/HtDP2e/), and as the natural numbers illustrate, it's not a hard-and-fast distinction. But the ideas behind structural recursion transfer to many crucial areas of [computer science](https://en.wikipedia.org/wiki/Termination_analysis) and [mathematics](https://en.wikipedia.org/wiki/Structural_induction), so it's important to understand them nonetheless.