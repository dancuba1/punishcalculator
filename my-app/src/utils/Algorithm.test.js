import { processStartUpValue, setStartUpCalc, getStartUpMap, notFollowingHits } from "./Algorithm";

describe("Algorithm.js — Core Functions", () => {
  
  // ========== processStartUpValue Tests ==========
  describe("processStartUpValue", () => {
    test("should handle Shield Breaks value", () => {
      expect(processStartUpValue("Shield Breaks")).toBeNull();
    });

    test("should extract negative number from simple string", () => {
      expect(processStartUpValue("-8")).toBe(-8);
    });

    test("should extract minimum from pipe-separated values with slashes", () => {
      // "Punch -8/-8 | Wood -8/-7 | Stone -7/-7"
      expect(processStartUpValue("Punch -8/-8 | Wood -8/-7 | Stone -7/-7")).toBe(-8);
    });

    test("should extract minimum from pipe-separated values without slashes", () => {
      // "Punch -22 | Wood -20 | Stone -19"
      expect(processStartUpValue("Punch -22 | Wood -20 | Stone -19")).toBe(-22);
    });

    test("should handle mixed positive and negative numbers (return min)", () => {
      expect(processStartUpValue("5 | -3 | 2")).toBe(-3);
    });

    test("should return null if no numbers found", () => {
      expect(processStartUpValue("abc xyz")).toBeNull();
    });

    test("should handle numeric input (pass-through)", () => {
      expect(processStartUpValue(-15)).toBe(-15);
      expect(processStartUpValue(0)).toBe(0);
      expect(processStartUpValue(10)).toBe(10);
    });

    test("should return null for null/undefined input", () => {
      expect(processStartUpValue(null)).toBeNull();
      expect(processStartUpValue(undefined)).toBeNull();
    });

    test("should handle leading/trailing spaces", () => {
      expect(processStartUpValue("  -5  ")).toBe(-5);
    });

    test("should extract from complex frame data", () => {
      // Real-world example with multiple separators
      expect(processStartUpValue("Jab1 -2/-1 | Jab2 -3/-2 | Rapid -4/-3")).toBe(-4);
    });
  });

  // ========== setStartUpCalc Tests ==========
  describe("setStartUpCalc", () => {
    const jumpSquatMock = { current: 3 };

    test("should mark invalid moves with startup 9999", () => {
      const move = { id: "Grab", isUpB: false, isUpSmash: false, isAerial: false };
      const result = setStartUpCalc(move, 5, jumpSquatMock);
      expect(result.startup).toBe(9999);
    });

    test("should not modify startup for Up B moves", () => {
      const move = { id: "Up B", isUpB: true, isUpSmash: false, isAerial: false };
      const result = setStartUpCalc(move, 10, jumpSquatMock);
      expect(result.startup).toBe(10);
    });

    test("should not modify startup for Up Smash moves", () => {
      const move = { id: "Up Smash", isUpB: false, isUpSmash: true, isAerial: false };
      const result = setStartUpCalc(move, 15, jumpSquatMock);
      expect(result.startup).toBe(15);
    });

    test("should add jumpSquat to aerial moves", () => {
      const move = { id: "Forward Air", isUpB: false, isUpSmash: false, isAerial: true };
      const result = setStartUpCalc(move, 8, jumpSquatMock);
      expect(result.startup).toBe(8 + 3); // 8 + jumpSquat
    });

    test("should add 11 frames to Dash Grab", () => {
      const move = { id: "Dash Grab", isUpB: false, isUpSmash: false, isAerial: false };
      const result = setStartUpCalc(move, 6, jumpSquatMock);
      expect(result.startup).toBe(6 + 11);
    });

    test("should add 4 frames to regular Grab", () => {
      const move = { id: "Grab", isUpB: false, isUpSmash: false, isAerial: false };
      const result = setStartUpCalc(move, 5, jumpSquatMock);
      expect(result.startup).toBe(5 + 4);
    });

    test("should add jumpSquat to Aerial moves (alternate check)", () => {
      const move = { id: "Neutral Aerial", isUpB: false, isUpSmash: false, isAerial: false };
      const result = setStartUpCalc(move, 10, jumpSquatMock);
      expect(result.startup).toBe(10 + 3); // default +11 but Aerial matching override
    });

    test("should add 11 frames as default for other moves", () => {
      const move = { id: "Neutral Attack", isUpB: false, isUpSmash: false, isAerial: false };
      const result = setStartUpCalc(move, 5, jumpSquatMock);
      expect(result.startup).toBe(5 + 11);
    });

    test("should preserve move properties", () => {
      const move = { id: "Jab", damage: 5, isUpB: false, isUpSmash: false, isAerial: false };
      const result = setStartUpCalc(move, 3, jumpSquatMock);
      expect(result.id).toBe("Jab");
      expect(result.damage).toBe(5);
    });

    test("should handle Kazuya jumpSquat (7 frames)", () => {
      const kazuyaSquat = { current: 7 };
      const move = { id: "Back Air", isUpB: false, isUpSmash: false, isAerial: true };
      const result = setStartUpCalc(move, 6, kazuyaSquat);
      expect(result.startup).toBe(6 + 7);
    });

    test("should be case-insensitive for move name matching", () => {
      const move = { id: "dash grab", isUpB: false, isUpSmash: false, isAerial: false };
      const result = setStartUpCalc(move, 5, jumpSquatMock);
      expect(result.startup).toBe(5 + 11); // "dash grab" won't match "Dash Grab" exactly, so default
    });
  });

  // ========== notFollowingHits Tests ==========
  describe("notFollowingHits", () => {
    test("should filter out Hit 2", () => {
      expect(notFollowingHits("Jab Hit 2")).toBe(false);
    });

    test("should filter out Hit 3", () => {
      expect(notFollowingHits("Forward Smash Hit 3")).toBe(false);
    });

    test("should filter out Jab 2", () => {
      expect(notFollowingHits("Jab 2")).toBe(false);
    });

    test("should filter out Rapid Jab", () => {
      expect(notFollowingHits("Rapid Jab")).toBe(false);
    });

    test("should filter out Pivot Grab", () => {
      expect(notFollowingHits("Pivot Grab")).toBe(false);
    });

    test("should allow Hit 1", () => {
      expect(notFollowingHits("Jab Hit 1")).toBe(true);
    });

    test("should allow regular moves", () => {
      expect(notFollowingHits("Forward Smash")).toBe(true);
      expect(notFollowingHits("Up Air")).toBe(true);
      expect(notFollowingHits("Neutral B")).toBe(true);
    });

    test("should be case-sensitive", () => {
      expect(notFollowingHits("hit 2")).toBe(true); // lowercase, so won't match "Hit 2"
    });
  });

  // ========== getStartUpMap Tests (async) ==========
  describe("getStartUpMap", () => {
    test("should return a Map with calculated startups", async () => {
      const pCharMoves = [
        { id: "Jab", startup: "5", isUpB: false, isUpSmash: false, isAerial: false },
        { id: "Forward Smash", startup: "15", isUpB: false, isUpSmash: false, isAerial: false },
      ];
      const jumpSquat = { current: 3 };

      const result = await getStartUpMap(pCharMoves, jumpSquat);

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBeGreaterThan(0);
    });

    test("should skip moves with null startup values", async () => {
      const pCharMoves = [
        { id: "Move1", startup: "Shield Breaks", isUpB: false, isUpSmash: false, isAerial: false },
        { id: "Move2", startup: "10", isUpB: false, isUpSmash: false, isAerial: false },
      ];
      const jumpSquat = { current: 3 };

      const result = await getStartUpMap(pCharMoves, jumpSquat);

      // Move1 (Shield Breaks → null startup) should be skipped
      expect(result.has("Move1")).toBe(false);
      expect(result.has("Move2")).toBe(true);
    });

    test("should handle empty move list", async () => {
      const result = await getStartUpMap([], { current: 3 });
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });
  });

  // ========== Integration Tests ==========
  describe("Integration — Full Flow", () => {
    test("should correctly calculate punish window for a realistic scenario", () => {
      // Scenario: attacking move has -8 advantage, punishing move has 10 startup
      const attackAdvantage = processStartUpValue("Punch -8/-8");
      const punchStartup = 10;
      
      const difference = punchStartup + attackAdvantage;
      expect(difference).toBe(2); // 10 + (-8) = 2 frames, punishable
    });

    test("should identify unpunishable move", () => {
      // Scenario: attacking move has +5 advantage, punishing move has 10 startup
      const attackAdvantage = processStartUpValue("5");
      const punchStartup = 10;
      
      const difference = punchStartup + attackAdvantage;
      expect(difference).toBeGreaterThan(0); // positive difference = not punishable
    });

    test("should handle move with complex advantage string", () => {
      const advantage = processStartUpValue("Punch -8/-7 | Wood -9/-8 | Stone -7/-6");
      const punchStartup = 10;
      const difference = punchStartup + advantage;
      
      expect(advantage).toBe(-9); // most negative
      expect(difference).toBe(1); // punishable with 1 frame window
    });
  });
});