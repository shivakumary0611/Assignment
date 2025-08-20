import java.util.*;

public class Count {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        HashMap<Integer, String> map = new HashMap<>();
        map.put(0, "zero ");
        map.put(1, "one ");
        map.put(2, "two ");
        map.put(3, "three ");
        map.put(4, "four ");
        map.put(5, "five ");
        map.put(6, "six ");
        map.put(7, "seven ");
        map.put(8, "eight ");
        map.put(9, "nine ");
        map.put(10, "ten ");
        map.put(11, "eleven ");
        map.put(12, "twelve ");
        map.put(13, "thirteen ");
        map.put(14, "fourteen ");
        map.put(15, "fifteen ");
        map.put(16, "sixteen ");
        map.put(17, "seventeen ");
        map.put(18, "eighteen ");
        map.put(19, "nineteen ");
        map.put(20, "twenty ");
        map.put(30, "thirty ");
        map.put(40, "forty ");
        map.put(50, "fifty ");
        map.put(60, "sixty ");
        map.put(70, "seventy ");
        map.put(80, "eighty ");
        map.put(90, "ninety ");

        System.out.println("Enter the number within crores:");
        long numberInput = sc.nextLong();

        StringBuilder sb = new StringBuilder();

        while (numberInput != 0) {
            if (numberInput / 10000000 > 0) {
                int i = (int) (numberInput / 10000000);
                sb.append(getWord(i, map)).append("crore ");
                numberInput %= 10000000;
            }
            if (numberInput / 100000 > 0) {
                int i = (int) (numberInput / 100000);
                sb.append(getWord(i, map)).append("lakh ");
                numberInput %= 100000;
            }
            if (numberInput / 1000 > 0) {
                int i = (int) (numberInput / 1000);
                sb.append(getWord(i, map)).append("thousand ");
                numberInput %= 1000;
            }
            if (numberInput / 100 > 0) {
                int i = (int) (numberInput / 100);
                sb.append(map.get(i)).append("hundred ");
                numberInput %= 100;
            }
            if (numberInput > 0) {
                sb.append(getWord((int) numberInput, map));
                numberInput = 0;
            }
        }

        System.out.println(sb.toString().trim());
    }

    // helper function to get correct word
    public static String getWord(int num, HashMap<Integer, String> map) {
        if (map.containsKey(num)) return map.get(num);
        else {
            int tens = (num / 10) * 10;
            int ones = num % 10;
            return map.get(tens) + map.get(ones);
        }
    }
}
