> **Summary**

> Binary trees are an important recursively-defined data structure in Racket. The following article explains why binary nodes and trees are the same thing.

Binary trees are a classic example of a recursive data type. Consider the following definition for a binary tree:

```scheme
; A Binary-Tree is one of:
; - empty
; - (make-binary-node Number Binary-Node Binary-Node)
(define-struct binary-node (val left right))
```

In the above definition, our `define-struct` is for a binary **node**, but our English definition describes a binary **tree**. This can be confusing at first -- aren't trees composed of nodes? The answer is that **individual nodes, including `empty`, are their own (sub)trees**.

Observe the following diagram of a binary tree:

```
       7
     /   \
    5     9
   / \     \
  1   6    11
 / \ / \   / \
 
```
> **Note**
> In this example, the hanging slashes on `1`, `6`, and `11` represent their empty `left` and `right` fields. However, nodes without children still have these fields; they just have the value `empty`.

Now zoom in on the left subtree of `7`.

```
    5
   / \ 
  1   6
 / \ / \
```

***This subtree is its own, independent, complete, fully-functional tree.*** It just so happens to be a subtree of `7`, but even if we didn't know anything about its parent node, we could still conduct tree operations on `5` and its children.

Zoom in again on the node with value 1.

```
     1
   /   \
empty  empty
```

This single node is its own tree, too! In fact, since `empty` is a `Binary-Tree` by definition of the latter, the leaves of our `1`-node (`empty` and `empty`) are `Binary-Tree`s too.

The recursive definition of binary trees corresponds exactly to the recursive definition of lists. Specifically, these parts are directly analogous:

```scheme
; A List-of-Numbers is one of:
; ...
; - (cons Number List-of-Numbers)

; A Binary-Tree is one of:
; ...
; - (make-binary-node Number Binary-Node Binary-Node)
```

A nonempty `List-of-Numbers` consists of two components: the "current" `Number`, and the remaining `List-of-Numbers`, which itself is a complete list. A nonempty `Binary-Tree` consists of three components: the "current" `Number`, and two descendant `Binary-Tree`s, which are themselves complete binary trees.