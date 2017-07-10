;; By Sarah Lim
;; http://sarahlim.com/eecs-111/

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Q1. Scope and Mutation
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; In most countries, the age of majority is 18.
;; Some countries have different laws. In Scotland, for instance,
;; the age of majority is 16.

;; Suppose we want to write a program to determine whether
;; someone is a legal adult.
;; We'll write a global version that works for most countries,
;; and a Scotland-specific version.

;; Here are three DIFFERENT versions of this program.

;; Version 1
(define age-of-majority 18)

;; number -> boolean
(define (is-adult? age)
  (>= age age-of-majority))

;; number -> boolean
(define (is-adult?/scotland age)
  (begin (set! age-of-majority 16)
         (>= age age-of-majority)))


;; Version 2
(define age-of-majority 18)

;; number -> boolean
(define (is-adult? age)
  (>= age age-of-majority))

;; number -> boolean
(define (is-adult?/scotland age)
  (local [(define age-of-majority 16)]
    (is-adult? age)))


;; Version 3
(define age-of-majority 18)

;; number -> boolean
(define (is-adult? age)
  (>= age age-of-majority))

;; number -> boolean
(define (is-adult?/scotland age)
  (local [(define age-of-majority 16)
          (define (helper a)
            (>= a age-of-majority))]
    (helper age)))


;; Each of these programs will yield a different result
;; for the following series of function calls:

(is-adult? 16)
(is-adult?/scotland 16)
(is-adult? 16)


;; (a) What will the results of each call be, for each program
;; Try to answer first without running the programs.

; ;; Version 1
; 
; ;; Version 2
; 
; ;; Version 3


;; (b) Which result (and which program) is correct?

;; (c) What is the difference between the programs?
;; In other words, WHY does each program yield the results it does?

;; (d) Bonus: How would you modify the incorrect versions to be correct?
;; Assume you can only add new code to `is-adult?/scotland`.

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Q2. Imperative Programming vs. Functional Programming
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; (a) For each of the following code snippets, fill in the
;; placeholder with ONE expression, either `map` or `for-each`,
;; such that the program returns the correct results.

(define lon (list 1 2 3 4 5))
 
;; ...
 
lon  ; (list 10 20 30 40 50)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-struct person [first last])
(define sood (make-person "Sara" "Sood"))
(define horswill (make-person "Ian" "Horswill"))
(define zhang (make-person "Haoqi" "Zhang"))
 
(define people (list sood horswill zhang))
 
;; ...
 
(person-first sood)      ; "S"
(person-first horswill)  ; "I"
(person-first zhang)     ; "H"

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-struct person [first last])
(define sood (make-person "Sara" "Sood"))
(define horswill (make-person "Ian" "Horswill"))
(define zhang (make-person "Haoqi" "Zhang"))
 
(define people (list sood horswill zhang))
 
(filter (lambda (p)
          (string=? (person-first p) "I"))
        ;; ...
        )
;; (list (make-person "I" "Horswill"))


;; (b) For each of the snippets above, could you produce a
;; working solution by changing `map` to `for-each` or vice versa?

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Q3. Iteration vs. Recursion
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; Here is a recursive implementation of a function to compute
;; the product of a list of numbers:

; ;; (listof number) -> number
(define (product lon)
  (cond [(empty? lon) 1]
        [else (* (first lon)
                 (product (rest lon)))]))


;; As you've probably seen, there are lots of different ways to
;; implement the same list operation, especially using imperative
;; programming.

;; The purpose of this section is to help you develop a better
;; intuition for WHY each of these strategies works, by implementing
;; `product` in various ways.

;; Fill out the ... in each snippet.
;; Each ... is either a single keyword (e.g. `if`, `unless`, `begin`, etc.)
;; or a single expression.

;; (a) Iterative recursion
;; List: argument
;; Result: argument
;; Helper function returns: number
(define (product lon)
  (local [; (listof number) number -> number
          (define (loop remaining result)
            (if (empty? remaining)
                ...
                (... (rest remaining)
                     (* (first remaining) result))))]
    ...))


;; (b) Separate result variable
;; List: argument
;; Result: variable
;; Helper function returns: number
 (define (product lon)
   (local [(define result ...)
           ;; (listof number) -> number
           (define (loop remaining)
             (if (empty? remaining)
                 ...
                 (begin ...
                        (loop (rest remaining)))))]
     ...))


;; (c) Separate result variable AND void helper
;; List: argument
;; Result: variable
;; Helper function returns: void
 (define (product lon)
   (local [(define result ...)
           ;; (listof number) -> void
           (define (loop remaining)
             (unless (empty? remaining)
               (begin ...
                      (loop (rest remaining)))))]
     ...))


;; (d) Separate result AND list variables; void helper
;; List: variable
;; Result: variable
;; Helper function returns: void
 (define (product lon)
   (local [(define remaining ...)
           (define result ...)
           ;; -> void
           (define (loop)
             (unless (empty? remaining)
               (begin ...
                      ...
                      (loop))))]
     ...))


;; (e) for-each
 (define (product lon)
   (local [...]
     (... (for-each (lambda (n) ...)
                    lon)
          ...)))


;; BONUS: Implement the following function, using each of the
;; constraints in (a) - (e).

;; longest : (listof string) -> number
;; returns the length of the longest string in the list


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Q4. apply vs. foldl
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; (a) Recall this question from a previous assignment:

;; Write a recursive function, `depth-tree`, that returns
;; the number of levels of nesting in a `ListTree`.

;; depth-tree : ListTree -> number

;; For instance,

(depth-tree 1)
;; => 0, it's not even a list

(depth-tree (list 1 2))
;; => 1

(depth-tree (list (list 1)
                  7
                  (list 1 4 2)))
;; => 2


;; You probably implemented this function using `foldl`.
;; Rewrite it using `apply`.

;; (b) In general, you can use `apply` and `fold(l/r)` for the
;; same categories of problems (consolidating a list into a single
;; object using some combiner function). For instance:

(foldl + 0 (list 1 2 3 4))
(apply + (list 1 2 3 4))

(foldr string-append "" (list "a" "b" "c" "d"))
(apply string-append (list "a" "b" "c" "d"))


;; Come up with a usage example for `apply` that does NOT work
;; for `fold(l/r)`.

;; Hint:
(require 2htdp/image)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Q5. Inheritance
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(require cs111/define-struct)

;; Consider the following inheritance hierarchy:
;;
;;        Animal
;;        __|___
;;       |      |
;;      Dog    Cat

;; (a) Implement the following structs:

;; An Animal is an ABSTRACT base type.
;;
;; Properties:
;; - name, a string
;;
;; Methods:
;; - greet : -> string, returns "hi, I am <name>"


;; A Cat is a subtype of Animal.
;;
;; Properties:
;; - favorite-fish, one of "tuna" "mackerel" "sardine"
;;
;; Methods:
;; - greet : -> string, returns
;; "meow, I am <name> and my favorite fish is <favorite-fish>"


;; A Dog is a subtype of Animal.
;;
;; Properties:
;; - favorite-game, one of "fetch" "agility" "nap"
;;
;; Methods:
;; - greet : -> string, returns
;; "woof, I am <name> and my favorite game is <favorite-game>"


;; (b) Define the following variables:

;; A cat named "Peaches" whose favorite fish is "tuna"
(define peaches ...)


;; A cat named "Tubbs" whose favorite fish is "mackerel"
(define tubbs ...)


;; A dog named "Jake" whose favorite game is "nap"
; you can write define yourself ok


;; (c) Now change every animal's favorite (food/game), and change
;; all of their names too. (It's hard to think of practice questions
;; for inheritance ok)
