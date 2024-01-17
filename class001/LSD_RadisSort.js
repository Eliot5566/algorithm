//LSD Radix Sort
//用來排序整數的穩定排序演算法，根據鍵值的每一位的數值，將要排序的元素分配至某些桶子中，藉以達到排序的作用
var counter = [];
//counter用來記錄每個桶子的數量
function radixSort(arr, maxDigit) {
    var mod = 10;
    //mod用來取餘數 10
    var dev = 1;
    //dev用來取商數 1

    for (var i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
        //maxDigit為最大位數  for迴圈跑maxDigit次 dev每次乘10  mod每次乘10 為甚麼要乘10? 因為每次都要取個位數 十位數 百位數
        //上面迴圈用來取得最大位數的值 也就是maxDigit的值 並且將dev和mod的值設定好 也就是dev=1 mod=10 dev=10 mod=100 dev=100 mod=1000 用來取個位數 十位數 百位數 千位數


        for (var j = 0; j < arr.length; j++) {
            //arr.length為陣列長度  for迴圈跑arr.length次 也就是陣列長度次 
            var bucket = parseInt((arr[j] % mod) / dev);
            //bucket用來記錄每個桶子的數量  parseInt為取整數  arr[j] % mod為取餘數  / dev為取商數  也就是取個位數 十位數 百位數
            //每次回圈都會取得arr[j]的個位數 十位數 百位數 千位數 並且存放在bucket裡面
            //如果是87的話 87 % 10 = 7  7 / 1 = 7  bucket = 7
            //如果是941的話 941 % 100 = 41  41 / 10 = 4  bucket = 4
            //整體來看就是取個位數 十位數 百位數 千位數 並且存放在bucket裡面 每個位數都有一個bucket
            //87的bucket為7  941的bucket為4 用來記錄每個桶子的數量 也就是counter[7] = 87  counter[4] = 941
            //這樣區分的用意是甚麼 因為每個位數都有一個bucket
            // 也就是counter[0] = 0  counter[1] = 1  counter[2] = 2  counter[3] = 3  counter[4] = 4  counter[5] = 5  counter[6] = 6  counter[7] = 7  counter[8] = 8  counter[9] = 9
            //十位數也是一樣 也就是counter[0] = 0  counter[1] = 1  counter[2] = 2  counter[3] = 3  counter[4] = 4  counter[5] = 5  counter[6] = 6  counter[7] = 7  counter[8] = 8  counter[9] = 9
            //百位數也是一樣 也就是counter[0] = 0  counter[1] = 1  counter[2] = 2  counter[3] = 3  counter[4] = 4  counter[5] = 5  counter[6] = 6  counter[7] = 7  counter[8] = 8  counter[9] = 9
            //可以看到每個位數都有一個bucket 也就是counter[0] = 0  counter[1] = 1  counter[2] = 2  counter[3] = 3  counter[4] = 4  counter[5] = 5  counter[6] = 6  counter[7] = 7  counter[8] = 8  counter[9] = 9
            

            if (counter[bucket] == null) {
                //如果counter[bucket]為空值 也就是沒有值
                counter[bucket] = [];
                //counter[bucket]就等於空陣列
            }
            counter[bucket].push(arr[j]);
            //counter[bucket]陣列push進arr[j]的值
        }

        var pos = 0;
        //pos是陣列的位置 下面迴圈用來排序 也就是將counter陣列的值push進arr陣列
        for (var j = 0; j < counter.length; j++) {
            //舉來來說  counter[0] = 0  counter[1] = 1  counter[2] = 2  counter[3] = 3  counter[4] = 4  counter[5] = 5  counter[6] = 6  counter[7] = 7  counter[8] = 8  counter[9] = 9
            //會把counter[0]的值push進arr陣列 也就是arr[0] = 0  arr[1] = 1  arr[2] = 2  arr[3] = 3  arr[4] = 4  arr[5] = 5  arr[6] = 6  arr[7] = 7  arr[8] = 8  arr[9] = 9
         
            //counter.length為counter陣列的長度  for迴圈跑counter.length次 也就是counter陣列長度次
            var value = null;
            //value是空值 用來存放counter[j]的值
            if (counter[j] != null) {
                //如果counter[j]不是空值 也就是有值
                while ((value = counter[j].shift()) != null) {
                    //while迴圈跑counter[j].shift()的值 也就是counter[j]的第一個值 並且不是空值 [shift()為取出第一個值]
                    arr[pos++] = value;
                    //arr[pos++]為arr陣列的第一個值 也就是arr[0] 並且+1
                }
            }
        }
    }
    return arr;
}

radixSort([3, 5, 1, 2, 4], 1);