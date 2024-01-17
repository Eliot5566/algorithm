//LSD Radix Sort
//用來排序整數的穩定排序演算法，根據鍵值的每一位的數值，將要排序的元素分配至某些桶子中，藉以達到排序的作用
var counter = [];

function radixSort(arr, maxDigit) {
    var mod = 10;

    var dev = 1;


    for (var i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {


        for (var j = 0; j < arr.length; j++) {
            var bucket = parseInt((arr[j] % mod) / dev);

            if (counter[bucket] == null) {
                counter[bucket] = [];
            }
            counter[bucket].push(arr[j]);
        }

        var pos = 0;
        for (var j = 0; j < counter.length; j++) {

            var value = null;
            if (counter[j] != null) {
                while ((value = counter[j].shift()) != null) {
                    arr[pos++] = value;
                }
            }
        }
    }
    return arr;
}

radixSort([3, 5, 1, 2, 4], 1);