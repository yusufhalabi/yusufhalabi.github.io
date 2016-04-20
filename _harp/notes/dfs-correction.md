# Clearing up DFS from recitation

*Sarah Lim*  (slim at northwestern dot edu)  
19 April 2016

I goofed in recitation yesterday when we were talking about preorder, inorder, and postorder DFS.

Immediately prior, when were talking about breadth first search on binary trees, I had the following pseudocode on the board:

```
BFS(root):
  q = new Queue
  q.enqueue(root)

  while q is not empty:
    current = q.dequeue()
    print current  // or process current somehow
    if current.left exists, then q.enqueue(current.left)
    if current.right exists, then q.enqueue(current.right)
```

Then I waved my arms and said that to convert this BFS code to DFS, you just had to replace "queue" with "stack" (and change all the relevant operations, e.g. "enqueue" ⇒ "push", "dequeue" ⇒ "pop"). So we'd have something like this:

```
ConvertedDFS(root):
  s = new Stack
  s.push(root)

  while s is not empty:
    current = s.pop()
    print current  // or process current somehow
    if current.left exists, then s.push(current.left)
    if current.right exists, then s.push(current.right)
```

Well, is this DFS? Yes, technically, but it requires some clarification in the context of what we talked about next: preorder, inorder, and postorder traversal.

Namely, recall that we can change the traversal order by moving this line around:

``` 
print current  // or process current somehow
```

So to get **inorder** traversal, we'd write:

```
process left
process current
process right
```

and **postorder** would be:

```
process left
process right
process current
```

Given all this, you would *think* that after replacing "queue" with "stack" in the BFS code above, we'd end up with **preorder DFS**, since we're processing the `current` node *prior to* processing its children. Then, we could move around the "process `current`" line to change the ordering of the traversal, right?
 
*In reality* (and this is where I goofed), directly converting the above pseudocode to DFS will always give you "backwards preorder" traversal -- *regardless of where you move the "process current node" line*.
 
What do I mean by "backwards preorder"? Good question, because it's not really a thing. Suppose I have the following tree:

```
      5
     / \
    2   7
   / \   \
  1   4   11
```
 
For this tree, we'd expect that following orderings:

* **Preorder:** `5, 2, 1, 4, 7, 11`
* **Inorder:** `1, 2, 4, 5, 7, 11`
* **Postorder:** `1, 4, 2, 11, 7, 5`
 
It turns out that converting the BFS pseudocode to DFS will print the above tree in the following "backwards preorder": `5, 7, 11, 2, 4, 1`. 

This is exactly what would happen if you first mirrored the tree, and then did preorder traversal. Alternatively, using the dot-and-trace trick from recitation, this is what would happen if we did *post*order traversal starting from the root and tracing down the *right* perimeter of the tree first (instead of the left, which is how it normally works).
 
Why does this happen? The reason is pretty simple, actually. When we push a child onto the stack, we *aren't actually processing the child*. That is,
 
```
s.push(current.left)
```

is different from 

``` 
process left
```

which would look more like
 
```
print current.left
s.push(current.left.left)
s.push(current.left.right)
```

In other words, in our converted DFS pseudocode, we aren't actually processing the left and right children quite yet. We're just *adding them to the stack*, which is sort of like the "waiting area" for processing. In fact, we don't actually start processing a new node until the current loop iteration wraps up, and we restart and `s.pop()` spits out a new `current` for us to work with.
 
Now, because a stack is **LIFO (last in, first out)**, `s.pop()` spits out children in reverse order, *regardless of whether we pushed their parent before, after, or between them*.

So even if the body of my loop looks like:

```
while blah blah:
  push left
  process current
  ...500 lines of useless gibberish...
  push right
  ...500 more lines of gibberish...
```

we still only process one node (`current`) in this iteration, and at the end of that iteration, calling `s.pop()` will return items starting from the most recently inserted.

This means we always end up with the following processing order:

1. `current` (the only item processed on this iteration)
2. `right` (the result of calling `s.pop()` on the next iteration)
3. `left` (the result of calling `s.pop()` on the next-next iteration)

How do we remedy this problem? Rather than just converting the BFS pseudocode to DFS by replacing "queue" with "stack", we can use the following:

```
DFS(root):
    print root  // or check its value, or whatever
    if root has left child, then DFS(left)
    if root has right chid, then DFS(right)
    return
```

This recursive pseudocode essentially implements the exact same algorithm, using the [execution stack](https://en.wikipedia.org/wiki/Call_stack) (also referred to as the "call stack") as our "stack." In other words, this time we *actually* `DFS()` the children on the spot, instead of just `s.push()`ing them into stack purgatory to wait another iteration or two to get processed.
 
Hopefully that clears things up for folks, and big ups to the two people who backchannelled me for clarification! Sometimes I say things that make literally no sense, so you should def bring these things to my attention  ¯\\\_(ツ)\_/¯