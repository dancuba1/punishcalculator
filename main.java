class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int left = 0;
        int right = h;
        int currentMinK = h;
        while(left<=right){
            int k  = (left + right) / 2;
            System.out.println("current k " + k);

            int timeLeft = h;
            for(int pile : piles){
                int timeToEat = Math.max(1, pile / k);
                timeLeft -= timeToEat;
                System.out.println("timeLeft " + timeLeft);
                if(timeLeft < 0){
                    break;
                }
            }
            if(timeLeft > 0){
                currentMinK = Math.min(currentMinK, k);
                right = k - 1;
            }else if(timeLeft < 0){
                right = k + 1;
            }else{
                return k;
            }
        }

        return currentMinK;
    }
}
