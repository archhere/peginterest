describe("primeFactorization", () => {
  it("handles an input of 2", () => {
    expect(primeFactorization(2)).toEqual([2]);
  });

  it("Test case: 12", () => {
    expect(primeFactorization(12)).toEqual([2,2,3]);
  });

  it("Test case: 600851475143", () => {
    expect(primeFactorization(600851475143)).toEqual([71,839,1471,6857]);
  });
});

describe('baseConverter', () => {
  it('converts a small number in binary', () => {
    expect(baseConverter(5, 2)).toEqual('101');
  });

  it('converts a large number into base 15', () => {
    expect(baseConverter(1239449, 16)).toEqual('12e999' || '12E999');
  });
});

describe("deepDup", () => {
  beforeEach( () => {
    robotParts = [
      ["nuts", "bolts", "washers"],
      ["capacitors", "resistors", "inductors"]
    ];
    
    copy = deepDup(robotParts);
  });

  it("makes a copy of the original array", () => {
    expect(copy).toEqual(robotParts);
  });

  it("deeply copies arrays", () => {
    copy[1].push("LEDs");
    expect(robotParts[1]).toEqual(["capacitors", "resistors", "inductors"]);
  });
});

describe("exponent", () => {
  it("correctly handles positive powers", () => {
    expect(exponent(5, 3)).toEqual(125);
  });

  it("correctly handles negative powers", () => {
    expect(exponent(2, -3)).toEqual(1/8.0);
  });

  it("correctly handles 0", () => {
    expect(exponent(2, 0)).toEqual(1);
  });
});

describe('subsets', () => {
  it("Correctly returns all subsets of an array", () => {
    const subs = [
      [], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]
    ];

    expect(subsets([1, 2, 3])).toEqual(subs);
  });
});

describe("stringIncludeKey", () => {
  it("returns true for the same string", () => {
    expect(stringIncludeKey("adblfci", "abc")).toEqual(true);
  });

  it("handles keys with duplicate characters: case 1", () => {
    expect(stringIncludeKey("adbblfci", "abbc")).toEqual(true);
  });

  it("handles keys with duplicate characters: case 2", () => {
    expect(stringIncludeKey("adbclfci", "abbc")).toEqual(false);
  });

  it("returns false if the key characters are in the wrong order", () => {
    expect(stringIncludeKey("dblfcia", "abc")).toEqual(false);
  });

  it("returns false if the string doesn't contain the key", () => {
    expect(stringIncludeKey("db", "abc")).toEqual(false);
  });
});

describe('fibsSum', () => {
  it('It correctly gets the answer for the 1st fibonacci number', () => {
    expect(fibsSum(1)).toEqual(1);
  });

  it('It correctly gets the answer for the first 2 fibonacci numbers', () => {
    expect(fibsSum(2)).toEqual(2);
  });

  it('It correctly gets the answer for the first 6 fibonacci numbers', () => {
    expect(fibsSum(6)).toEqual(20);
  });
});

describe("#permutations", () => {
  it("returns all permutations of an array", () => {
    const array = [1, 2, 3];
    const allPermutations = [
      [1, 2, 3], [1, 3, 2], [2, 1, 3],
      [2, 3, 1], [3, 1, 2], [3, 2, 1]
    ];

    expect(permutations([1, 2, 3])).toEqual(allPermutations);
  });
});

describe("#digitalRoot", () => {
  it("calculates the digital root of a single-digit number", () => {
    expect(digitalRoot(9)).toEqual(9);
  });

  it("calculates the digital root of a larger number", () => {
    expect(digitalRoot(4322)).toEqual(2);
  });
  //
  // it("does not call #to_s on the argument", () => {
  //   expect_any_instance_of(Fixnum).to_not receive(:to_s)
  //   digitalRoot(4322);
  // });
});

describe('firstEvenNumbersSum', () => {
  it("Correctly returns the sum of the first even number", () => {
    expect(firstEvenNumbersSum(1)).toEqual(2);
  });

  it("Returns the sum of the first n even numbers", () => {
    expect(firstEvenNumbersSum(6)).toEqual(42);
  });
});

describe("#recSum", () => {
  it("returns the sums of all elements in an array", () => {
    arr = [1,2,3,4];
    expect(recSum(arr)).toEqual(10);
  });

  it("returns 0 if the array is empty", () => {
    expect(recSum([])).toEqual(0);
  });
});

describe("#factorialsRec", () => {
  it("returns first factorial number", () => {
    expect(factorialsRec(1)).toEqual([1]);
  });

  it("returns first two factorial numbers", () => {
    expect(factorialsRec(2)).toEqual([1, 1])
  });

  it("returns many factorials numbers", () => {
    expect(factorialsRec(6)).toEqual([1, 1, 2, 6, 24, 120]);
  });

  // it("calls itself recursively", () => {
  //   // this should enforce you calling your method recursively.
  //
  //   expect(self).to receive(:factorialsRec).at_least(:twice).and_call_original
  //   factorialsRec(6)
  // });
});

describe("#factors", () => {
  it("returns the factors of 10 in order", () => {
    expect(factors(10)).toEqual([1, 2, 5, 10]);
  });

  it("returns just two factors for primes", () => {
    expect(factors(13)).toEqual([1, 13]);
  });
});

describe("#twoSum", () => {
  it("returns positions of pairs of numbers that add to zero", () => {
    expect([5, 1, -7, -5].twoSum()).toEqual([[0, 3]]);
  });

  it("finds multiple pairs", () => {
    expect([5, -1, -5, 1].twoSum()).toEqual([[0, 2], [1, 3]]);
  });

  it("finds pairs with same element", () => {
    expect([5, -5, -5].twoSum()).toEqual([[0, 1], [0, 2]]);
  });

  it("returns [] when no pair is found", () => {
    expect([5, 5, 3, 1].twoSum()).toEqual([]);
  });

  it("won't find spurious zero pairs", () => {
    expect([0, 1, 2, 3].twoSum()).toEqual([]);
  });

  it("will find real zero pairs", () => {
    expect([0, 1, 2, 0].twoSum()).toEqual([[0, 3]]);
  });
});

describe("myReverse", () => {
  beforeEach( () => {
    a = [ "a", "b", "c", "d" ];
  });

  it("Reverses an array", () => {
    expect(a.myReverse()).toEqual(a.reverse())
  });
});

describe("my_bsearch", () => {
  it("finds the first element in the array", () => {
    expect([1, 2, 3].myBsearch(1)).toEqual(0);
  });

  it("finds an element for an array with an even number of elements", () => {
    expect([2, 3, 4, 5].myBsearch(3)).toEqual(1);
  });

  it("finds an element for an array with an odd number of elements", () => {
    expect([2, 4, 6, 8, 10].myBsearch(6)).toEqual(2);
  });

  it("finds an element in the second half of the array (even)", () => {
    expect([1, 3, 4, 5, 9].myBsearch(5)).toEqual(3);
  });

  it("finds an element in the second half of the array (odd)", () => {
    expect([1, 2, 3, 4, 5, 6].myBsearch(6)).toEqual(5);
  });

  it("Returns nil if the element is not in the array (smaller)", () => {
    expect([1, 2, 3, 4, 5, 6].myBsearch(0)).toEqual(null);
  });

  it("Returns null if the element is not in the array (bigger)", () => {
    expect([1, 2, 3, 4, 5, 7].myBsearch(6)).toEqual(null);
  });
});

describe("#median", () => {
  beforeEach(() => {
    evenArray = [3, 2, 6, 7];
    oddArray = [3, 2, 6, 7, 1];
  });

  it("returns null for the empty array", () => {
    expect([].median()).toBe(null);
  });

  it("returns the element for an array of length 1", () => {
    expect([1].median()).toEqual(1);
  });

  it("returns the median of an odd-length array", () => {
    expect(oddArray.median()).toEqual(3);
  });

  it("returns the median of an even-length array", () => {
    expect(evenArray.median()).toEqual(4.5);
  });
});

describe("#primes", () => {
  it("returns first five primes in order", () => {
    expect(primes(5)).toEqual([2, 3, 5, 7, 11]);
  });

  it("returns an empty array when asked for zero primes", () => {
    expect(primes(0)).toEqual([]);
  });
});

describe("#transpose", () => {
  //before each necessary
  const arr = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];
  const small_arr = [
    [1, 2],
    [3, 4]
  ];
  const rect_arr = [
    [1, 2, 3],
    [4, 5, 6]
  ];
  const tall_rect_arr = [
    [1, 2],
    [3, 4],
    [5, 6]
  ];

  it("should transpose a matrix", () => {
    expect(transpose(arr)).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9]
    ]);
  });

  it("should transpose a matrix of a different size", () => {
    expect(transpose(small_arr)).toEqual([
      [1, 3],
      [2, 4]
    ]);
  });

  it("should transpose a rectangular matrix", () => {
    expect(transpose(rect_arr)).toEqual([
      [1, 4],
      [2, 5],
      [3, 6]
    ]);
  });

  it("should transpose a different rectangular matrix", () => {
    expect(transpose(tall_rect_arr)).toEqual([
      [1, 3, 5],
      [2, 4, 6]
    ]);
  });

  it("should not modify the original", () => {
    transpose(small_arr);
    expect(small_arr).toEqual([
      [1, 2],
      [3, 4]
    ]);
  });
});

describe("#dups", () => {
  it("solves a simple example", () => {
    expect([1, 3, 0, 1].dups()).toEqual({ 1: [0, 3] });
  });

  it("finds two dups", () => {
    expect([1, 3, 0, 3, 1].dups()).toEqual({ 1: [0, 4], 3: [1, 3] });
  });

  it("finds multi-dups", () => {
    expect([1, 3, 4, 3, 0, 3].dups()).toEqual({ 3: [1, 3, 5] });
  });

  it("returns {} when no dups found", () => {
    expect([1, 3, 4, 5].dups()).toEqual({});
  });
});

describe("flatten", () => {
  it('Flattens arrays correctly', () => {
    const array = [1, 2, 3, [4, [5, 6]], [[[7]], 8]];
    expect(array.flatten()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe("rotate", () => {
  a = [ "a", "b", "c", "d" ]

  it("Rotates the elements 1 position if no argument is passed in", () => {
    expect(a.rotate()).toEqual(["b", "c", "d", "a"]);
  });

  it("Rotates the elements correctly if an argument is passed in", () => {
    expect(a.rotate(2)).toEqual(["c", "d", "a", "b"]);
  });

  it("Rotates the elements correctly if a negative argument is passed in", () => {
    expect(a.rotate(-3)).toEqual(["b", "c", "d", "a"]);
  });

  it("Rotates the elements correctly for a large argument", () => {
    expect(a.rotate(15)).toEqual(["d", "a", "b", "c"]);
  });

});

describe("String.prototype.mySlice", () => {
  it("slices the string from the start index to the end index", () => {
    expect("abcd".mySlice(0, 2)).toEqual("ab");
  });

  it("slices to the end of the string when no second argument is passed", () => {
    expect("foobar".mySlice(3)).toEqual("bar");
  });

  it("returns an empty string when the first argument is higher", () => {
    expect("empty!".mySlice(1, 0)).toEqual("");
  });

  it("slices to the end of the string when the end index is greater than the string's length", () => {
    expect("super long string".mySlice(0, 200)).toEqual("super long string");
  });

  it("doesn't call `substr`, `slice`, or `substring`", () => {
    const str = new String("don't you do it!");
    spyOn(str, "substr");
    spyOn(str, "slice");
    spyOn(str, "substring");

    str.mySlice(0);

    expect(str.substr).not.toHaveBeenCalled();
    expect(str.slice).not.toHaveBeenCalled();
    expect(str.substring).not.toHaveBeenCalled();
  });
});

describe("myJoin", () => {
  beforeEach( () => {
    const a = ['a', 'b', 'c', 'd'];
  });

  it("joins an array if no argument is passed", () => {
    expect(a.myJoin()).toEqual("abcd")
  });

  it("joins an array if an argument is passed", () => {
    expect(a.myJoin("$")).toEqual("a$b$c$d")
  });
});

describe("myFind", () => {
  let arr, spy;
  beforeEach(() => {
    arr = [1, 2, 3];
    spy = {
      callback: (el) => false
    };
  });

  const equalsThree = (el) => el === 3;
  const equalsFour = (el) => el === 4;

  it("calls the callback passed to it", () => {
    spyOn(spy, "callback");

    myFind(arr, spy.callback);

    expect(spy.callback).toHaveBeenCalled();
  });
});

describe("#mergeSort", () => {
  beforeEach( () => {
    array = [3, 1, 2, 5, 4];
  });

  it("works with an empty array", () => {
    expect([].mergeSort()).toEqual([]);
  });

  it("works with an array of one item", () => {
    expect([1].mergeSort()).toEqual([1]);
  });

  it("sorts numbers", () => {
    expect(array.mergeSort()).toEqual(array.sort());
  });

  it("will use callback if given", () => {
    const callback = (x, y) => {
      if (y < x) return -1;
      return 1;
    };
    const reversed = array.mergeSort(callback);
    expect(reversed).toEqual([5, 4, 3, 2, 1])
  });

  it("does not modify original", () => {
    dupArray = array.slice(0);
    dupArray.mergeSort();
    expect(dupArray).toEqual(array);
  });
  //
  // it("calls the merge helper method", () => {
  //   expect(Array).to receive(:merge).at_least(:once).and_call_original
  //   array.mergeSort()
  // });
});

describe("#bubbleSort", () => {
  beforeEach(() => {
    array = [3, 1, 5, 4, 2];
  })

  it("works with an empty array", () => {
    expect([].bubbleSort().join()).toEqual([].join());
  });

  it("works with an array of one item", () => {
    expect([1].bubbleSort().join('')).toEqual([1].join(''));
  })

  it("sorts numbers", () => {
    expect(array.bubbleSort().join('')).toEqual(array.sort().join(''));
  });

  it("does not modify the original array", () => {
    const sortedArray = array.bubbleSort()
    expect(sortedArray).not.toEqual(array);
  })

  it("will use a callback if given", () => {
    const descendSort = (x, y) => {
      if (x > y) return -1;
      return 1;
    }

    let sorted = array.bubbleSort(descendSort)
    expect(sorted.join('')).toEqual([5, 4, 3, 2, 1].join(''));
  });
});

describe("#jumbleSort", () => {
  it("defaults to alphabetical order", () => {
    expect(jumbleSort("hello")).toEqual("ehllo");
  });

  it("takes an alphabet array and sorts by that order", () => {
    const alphabet = 'helo'.split('');

    expect(jumbleSort("hello", alphabet)).toEqual("hello");
  });

  it("sorts by a reversed alphabet", () => {
    reverse = 'abcdefghijklmnopqrstuvwxyz'.split('').reverse().join('')
    expect(jumbleSort("hello", reverse)).toEqual("ollhe");
  });
});

describe("quickSort", () => {
  it("Sorts an array of numbers with no duplicates", () => {
    const a = [ 2, 1, 3, 5, 0, 8, 4, 7, 6];
    expect(a.quickSort()).toEqual(a.sort());
  });

  it("Sorts an array of numbers with duplicates", () => {
    const a = [3, 1, 2, 3, 9, 17, 10, 432, 10];
    const sorted = [1, 2, 3, 3, 9, 10, 10, 17, 432];
    expect(a.quickSort()).toEqual(sorted);
  });

  it("Sorts according to the block passed in", () => {
    const a = [ 2, 1, 3, 5, 0, 8, 4, 7, 6];
    const callback = (x, y) => {
      if (y < x) return - 1;
      return 1;
    };

    expect(a.quickSort(callback)).toEqual(a.sort(callback));
  });
});

describe("#symmetricSubstrings", () => {
  it("handles a simple example", () => {
    expect("aba".symmetricSubstrings()).toEqual(["aba"]);
  });

  it("handles two substrings", () => {
    expect("aba1cdc".symmetricSubstrings()).toEqual(["aba", "cdc"]);
  });

  it("handles nested substrings", () => {
    expect("xabax".symmetricSubstrings()).toEqual(["aba", "xabax"]);
  });
});

describe("titleize", () => {
  it("capitalizes a word", () => {
    expect(titleize("jaws")).toEqual("Jaws");
  });

  it("capitalizes every word (aka title case)", () => {
    expect(titleize("david copperfield")).toEqual("David Copperfield");
  });

  it("doesn't capitalize 'little words' in a title", () => {
    expect(titleize("war and peace")).toEqual("War and Peace");
  });

  it("does capitalize 'little words' at the start of a title", () => {
    expect(
      titleize("the bridge over the river kwai")
    ).toEqual("The Bridge over the River Kwai");
  });
});

describe("#pigLatinify", () => {
  it("translates a word beginning with a vowel", () => {
    const s = pigLatinify("apple");
    expect(s).toEqual("appleay");
  });

  it("translates a word beginning with a consonant", () => {
    const s = pigLatinify("banana");
    expect(s).toEqual("ananabay");
  });

  it("translates a word beginning with two consonants", () => {
    const s = pigLatinify("cherry");
    expect(s).toEqual("errychay");
  });

  it("translates two words", () => {
    const s = pigLatinify("eat pie");
    expect(s).toEqual("eatay iepay");
  });

  it("translates a word beginning with three consonants", () => {
    expect(pigLatinify("three")).toEqual("eethray");;
  });

  it("counts 'sch' as a single phoneme", () => {
    const s = pigLatinify("school");
    expect(s).toEqual("oolschay");
  });

  it("counts 'qu' as a single phoneme", () => {
    const s = pigLatinify("quiet");
    expect(s).toEqual("ietquay");
  });

  it("counts 'qu' as a consonant when it's preceded by a consonant", () => {
    const s = pigLatinify("square");
    expect(s).toEqual("aresquay");
  });

  it("translates many words", () => {
    const s = pigLatinify("the quick brown fox");
    expect(s).toEqual("ethay ickquay ownbray oxfay");
  });
});

describe("#caesarCipher", () => {
  it("encodes a simple word", () => {
    expect(caesarCipher("aaa", 11)).toEqual("lll");
  });

  it("wraps around the alphabet", () => {
    expect(caesarCipher("zzz", 1)).toEqual("aaa");
  });

  it("encodes multiple words", () => {
    expect(caesarCipher("catz hatz", 2)).toEqual("ecvb jcvb");
  });
});

describe("realWordsInString", () => {
  it("finds a simple word", () => {
    const words = "asdfcatqwer".realWordsInString(["cat", "car"]);
    expect(words).toEqual(["cat"]);
  });

  it("doesn't find words not in the dictionary", () => {
    const words = "batcabtarbrat".realWordsInString(["cat", "car"]);
    expect(words).toEqual([]);
  });

  it("finds words within words", () => {
    const dictionary = ["bears", "ear", "a", "army"];
    const words = "erbearsweatmyajs".realWordsInString(dictionary);
    expect(words).toEqual(["bears", "ear", "a"]);
  });
});

describe('myEvery', () => {
  beforeEach( () => {
    a = [2, 4, 6];
  });

  it("returns true if all elements match the block", () => {
    const callback = x => x % 2 === 0;
    expect(a.myEvery(callback)).toBe(true);
  });

  it("returns false if not all elementes match the block", () => {
    const callback = x => x % 3 === 0;
    expect(a.myEvery(callback)).toBe(false);
  });
});

describe("#doubler", () => {
  beforeEach(() => {
    array = [1, 2, 3];
  });

  it("doubles the elements of the array", () => {
    expect(doubler(array)).toEqual([2, 4, 6]);
  });

  it("does not modify the original array", () => {
    const dupArray = array.slice(0);

    doubler(array);

    expect(array).toEqual(dupArray);
  });
});

describe('reject', () => {
  beforeEach( () => {
    a = [1, 2, 3];
  });

  it('it returns elements that do not match the passed in block', () => {
    const callback = x => x > 1;
    expect(a.reject(callback)).toEqual([1]);
  });

  it('It returns all elements if no elements match the block', () => {
    const callback = x => x === 4;
    expect(a.reject(callback)).toEqual([1,2,3]);
  });

});

describe('mySome', () => {
  beforeEach( () => {
    a = [1, 2, 3];
  });

  it("returns true if any number matches the block", () => {
    const callback = x => x > 1;
    expect(a.mySome(callback)).toBe(true);
  });

  it("returns false if no elementes match the block", () => {
    const callback = x => x === 4;
    expect(a.mySome(callback)).toBe(false);
  });
});

describe('myFilter', () => {
  beforeEach( () => {
    a = [1, 2, 3];
  });

  it('It correctly selects elements according to the passed in block', () => {
    const callback = x => x > 1;
    expect(a.myFilter(callback)).toEqual([2, 3]);
  });

  it('It returns an empty array if there are no matches', () => {
    const callback = x => x === 4;
    expect(a.myFilter(callback)).toEqual([]);
  });
});

describe('Array#myReduce', () => {
  let myArray;
  const noOp = (accum, el) => accum;

  const spy = {
    sum: (accum, el) => accum + el
  };

  it("calls the callback, passing in the accumulator and each element", () => {
    myArray = [1, 2, 3];
    spyOn(spy, "sum").and.callThrough();

    myArray.myReduce(spy.sum);

    expect(spy.sum).toHaveBeenCalledWith(1, 2);
    expect(spy.sum).toHaveBeenCalledWith(3, 3);
  });

  it("works with a sum callback", () => {
    myArray = [1, 2, 3, 4];
    expect(myArray.myReduce(spy.sum)).toEqual(10);
  });

  it("works with a multiplier callback", () => {
    myArray = [4, 4, 4];
    const times = (accum, el) => accum * el;

    expect(myArray.myReduce(times)).toEqual(64);
  });

  it("uses the first item as the accumulator", () => {
    myArray = [1, 2, 3, 4];
    expect(myArray.myReduce(noOp)).toEqual(1);
  });

  it("does not call Array.prototype.reduce", () => {
    myArray = [1, 2, 3, 4];
    spyOn(myArray, "reduce");

    myArray.myReduce(spy.sum);

    expect(myArray.reduce).not.toHaveBeenCalled();
  });
});

describe("myEach", () => {
  beforeEach( () => {
    callback = x => res.push(2 * x);
    array = [1, 2, 3];
  });

  it("it passes each element into a callback", () => {
    res = [];
    array.myEach(callback);
    expect(res).toEqual([2,4,6]);
  });

  it("returns the original array", () => {
    expect(array.myEach(callback)).toEqual([1, 2, 3]);
  });
});

describe("Function.prototype.myBind", () => {
  // let Cat;
  let sally, markov, curie;

  beforeEach(() => {
    class Cat {
      constructor (name) {
        this.name = name;
      }

      sayHello () {
        return this.name + " says hello!";
      }

      greetOne (otherCat) {
        return this.name + " says hello to " + otherCat.name;
      }

      greetTwo (otherCat1, otherCat2) {
        return this.name + " says hello to " + otherCat1.name + " and " +
          otherCat2.name;
      }
    }

    sally = new Cat("Sally");
    markov = new Cat("Markov");
    curie = new Cat("Curie");
  });

  it("should call the function method style on the context", () => {
    expect(sally.sayHello.myBind(sally)()).toEqual("Sally says hello!");
  });

  it("should pass in bind-time argument to the method", () => {
    expect(sally.greetOne.myBind(sally, markov)())
      .toEqual("Sally says hello to Markov");
  });

  it("should pass in two bind-time arguments to the method", () => {
    expect(sally.greetTwo.myBind(sally, markov, curie)())
      .toEqual("Sally says hello to Markov and Curie");
  });

  it("should combine bind-time and call-time arguments", () => {
    expect(sally.greetTwo.myBind(sally, markov)(curie))
      .toEqual("Sally says hello to Markov and Curie");
  });
});

describe("inherits", () => {
  let Animal, Dog, dog;

  beforeEach(() => {
    Animal = function() {
      this.name = "Yogi";
    };

    Animal.prototype.makeNoise = function() { return "Hi!"; };

    Dog = function() {
      this.age = 7;
    };

    Dog.inherits(Animal);

    Dog.prototype.bark = function() { return "Woof!"; };

    dog = new Dog();
  });

  it("should properly set up the prototype chain between a child and parent", () => {
    expect(dog.bark()).toBe("Woof!");
    expect(dog.makeNoise()).toBe("Hi!");
  });

  it("should not call the parent's constructor function", () => {
    expect(dog.name).toBeUndefined();
  });

  it("should maintain separation of parent and child prototypes", () => {
    Dog.prototype.someProperty = 42;
    const animal = new Animal();
    expect(animal.someProperty).toBeUndefined();
    expect(animal.makeNoise()).toBe("Hi!");
  });

  it("should properly work for longer inheritance chains", () => {
    const Poodle = function () { this.name = "Bill"; };

    Poodle.inherits(Dog);

    Poodle.prototype.shave = function() { return "Brrr."; };

    const poodle = new Poodle();
    expect(poodle.name).toBe("Bill");
    expect(poodle.shave()).toBe("Brrr.");
    expect(poodle.makeNoise()).toBe("Hi!");
    expect(poodle.bark()).toBe("Woof!");
  });
});

describe("Function.prototype.myCall", () => {
  beforeEach(() => {
    class Cat {
      constructor (name) {
        this.name = name;
      }

      sayHello () {
        return this.name + " says hello!";
      }

      greetOne (otherCat) {
        return this.name + " says hello to " + otherCat.name;
      }

      greetTwo (otherCat1, otherCat2) {
        return this.name + " says hello to " + otherCat1.name + " and " +
          otherCat2.name;
      }
    }

    sally = new Cat("Sally");
    markov = new Cat("Markov");
    curie = new Cat("Curie");
  });

  it("invokes the function it is called on", () => {
    expect(sally.greetOne.myCall(sally, markov)).toEqual("Sally says hello to Markov");
  });

  it("can take any number of arguments", () => {
    expect(sally.greetTwo.myCall(sally, markov, curie))
      .toEqual("Sally says hello to Markov and Curie");
  });
  it("does not use the 'call' function", () => {
    spyOn(Function.prototype, "call").and.callThrough();

    sally.greetTwo.myCall(sally, markov, curie);
    const count = Function.prototype.call.calls.count()
    expect(count).toBeLessThan(1);
  });

  it("should call the function method style on the context", () => {
    expect(sally.sayHello.myCall(markov)).toEqual("Markov says hello!");
  });
});

describe("Function.prototype.myCurry", () => {
  const adder = function (...argBalls) {
    return argBalls.reduce((a, b) => {
      return a + b;
    }, 0);
  }
  const addObj = { adder };


  it("collects up arguments until there are numArgs of them", () => {
    expect(adder.myCurry(3)(1)(2)(3)).toEqual(6);
  });

  it("should return itself if there are too few arguments still", () => {
    const myCurryResult = adder.myCurry(3)(1)(2);
    expect(myCurryResult).not.toEqual(6);
    expect(typeof(myCurryResult)).toEqual("function");
  });

  it("should call the original function", () => {
    spyOn(addObj, "adder");

    addObj.adder.myCurry(3)(1)(2)(3);
    expect(addObj.adder).toHaveBeenCalled();
  });

});

