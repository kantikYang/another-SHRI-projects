// рабочее решение

module.exports = Sequence;

const fromKey = Symbol('from');
const toKey = Symbol('to');
const stepKey = Symbol('step');
const currentValue = Symbol('current');

function Sequence(from, to, step) {
  if (!(this instanceof Sequence)) {
    return new Sequence(from, to, step);
  }

  this[fromKey] = from;
  this[toKey] = to;
  this[stepKey] = step;
  this[currentValue] = from;

  this[Symbol.iterator] = function () {
    let current = this[fromKey];
    if (from < to) {
      return {
        next: () => {
          if (current <= this[toKey]) {
            this[currentValue] = current;
            const value = current;
            current += this[stepKey];
            return { value, done: false };
          } else {
            return { done: true };
          }
        },
      };
    } else {
      return {
        next: () => {
          if (current >= this[toKey]) {
            this[currentValue] = current;
            const value = current;
            current -= this[stepKey];
            return { value, done: false };
          } else {
            return { done: true };
          }
        },
      };
    }
  };
}

Sequence.prototype.setStep = function (step) {
  this[stepKey] = step;
  this[fromKey] = this[currentValue];
};

Sequence.prototype[Symbol.toStringTag] = 'SequenceOfNumbers';

Sequence.prototype.constructor = Sequence;

Object.defineProperty(Sequence.prototype, 'constructor', {
  enumerable: false,
  writable: true,
  configurable: true,
});

Object.defineProperty(Sequence.prototype, 'setStep', {
  enumerable: false,
  writable: true,
  configurable: true,
});

const valueOfKey = Symbol('valueOfKey');
Sequence.prototype[valueOfKey] = function () {
  let count = Math.floor((this[toKey] - this[fromKey]) / this[stepKey]);
  console.log(
    'foo',
    Math.floor((this[toKey] - this[currentValue]) / this[stepKey])
  );
  console.log('boo', this[toKey], this[currentValue], this[stepKey]);
  return count + 1;
};

Sequence.prototype[Symbol.toPrimitive] = function (hint) {
  if (hint === 'string') {
    return `Sequence of numbers from ${this[currentValue]} to ${this[toKey]} with step ${this[stepKey]}`;
  } else if (hint === 'number') {
    return this[valueOfKey]();
  } else {
    return '[object Sequence]';
  }
};

// ТЕСТЫ

let sequence = null;
let iterator = null;
let sequence2 = null;
let iterator2 = null;
let result = null;

// Преобразования к примитивам
sequence = Sequence(0, 10, 1);

console.log(
  Object.prototype.toString.call(sequence) === '[object SequenceOfNumbers]',
  Object.prototype.toString.call(sequence)
);
console.log(
  String(sequence) === 'Sequence of numbers from 0 to 10 with step 1'
);
console.log(Number(sequence) === 11);

// Работает в цикле for-of
sequence = Sequence(5, -5, 1);

result = [];
for (const item of sequence) {
  result.push(item);
  //   console.log(item);
}

console.log(String([5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5]) === String(result));

// Работает деструктуризация последовательности
console.log(
  String([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) === String([...Sequence(0, 10, 1)])
);

// Работает метод setStep
sequence = Sequence(0, 10, 2);
iterator = sequence[Symbol.iterator]();

// console.log(iterator.next())
// console.log(iterator.next())
iterator.next();
iterator.next();
sequence.setStep(4);

console.log(Number(sequence) === 3, Number(sequence));
console.log(
  String(sequence) === 'Sequence of numbers from 2 to 10 with step 4',
  String(sequence)
);
console.log(
  String([...sequence]) === String([2, 6, 10]),
  String([...sequence])
);

// Скрыты лишние свойства и методы
sequence = Sequence(0, 10, 1);

console.log(String(Object.getOwnPropertyNames(sequence)) === String([]));
console.log(
  String(Object.getOwnPropertyNames(Sequence.prototype).sort()) ===
    String(['constructor', 'setStep']),
  String(Object.getOwnPropertyNames(Sequence.prototype).sort())
);

// Можно работать независимо с разными экземплярами последовательности
sequence = Sequence(0, 5, 1);
sequence2 = Sequence(10, 15, 1);
iterator = sequence[Symbol.iterator]();
iterator2 = sequence2[Symbol.iterator]();

iterator2.next();
iterator2.next();
iterator2.next();
sequence2.setStep(0.5);

iterator.next();
iterator.next();
sequence.setStep(2);

console.log(String([1, 3, 5]) === String([...sequence]), String([...sequence]));
console.log(
  String([12, 12.5, 13, 13.5, 14, 14.5, 15]) === String([...sequence2]),
  String([...sequence2])
);
