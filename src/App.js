import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";

export default function App() {
  const [time, setTime] = useState(40);
  const [isActive, setIsActive] = useState(false);
  const [restTime, setRestTime] = useState(30);
  const [isResting, setIsResting] = useState(false);
  const [sets, setSets] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState(400);
  const [totalSets, setTotalSets] = useState(46);
  const [jumpDuration, setJumpDuration] = useState(40);
  const [totalJumpTime, setTotalJumpTime] = useState(0);

  useEffect(() => {
    const calculatedSets = Math.ceil(
      calorieGoal / (8.67 * (jumpDuration / 60)),
    );
    setTotalSets(calculatedSets);
    setTotalJumpTime(calculatedSets * jumpDuration);
  }, [calorieGoal, jumpDuration]);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      if (isResting) {
        setIsResting(false);
        setTime(jumpDuration);
      } else {
        setSets((sets) => sets + 1);
        setIsResting(true);
        setTime(restTime);
      }
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time, isResting, restTime, jumpDuration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(jumpDuration);
    setIsResting(false);
    setSets(0);
  };

  const handleRestTimeChange = (e) => {
    setRestTime(parseInt(e.target.value) || 0);
  };

  const handleCalorieGoalChange = (e) => {
    const newGoal = parseInt(e.target.value) || 0;
    setCalorieGoal(newGoal);
  };

  const handleJumpDurationChange = (e) => {
    const newDuration = parseInt(e.target.value) || 0;
    setJumpDuration(newDuration);
    setTime(newDuration);
  };

  const caloriesBurned = Math.round(sets * 8.67 * (jumpDuration / 60));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {isResting ? "เวลาพัก" : "กระโดดเชือก"}
        </h1>
        <div className="text-6xl font-bold text-center mb-6">
          {Math.floor(time / 60)}:{time % 60 < 10 ? "0" : ""}
          {time % 60}
        </div>
        <div className="flex space-x-2 mb-4">
          <Button onClick={toggleTimer} className="flex-1">
            {isActive ? "หยุด" : "เริ่ม"}
          </Button>
          <Button onClick={resetTimer} className="flex-1">
            รีเซ็ต
          </Button>
        </div>
        <div className="mb-4">
          <Label htmlFor="jumpDuration" className="block mb-2">
            เวลากระโดด (วินาที):
          </Label>
          <Input
            id="jumpDuration"
            type="number"
            value={jumpDuration}
            onChange={handleJumpDurationChange}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="restTime" className="block mb-2">
            เวลาพัก (วินาที):
          </Label>
          <Input
            id="restTime"
            type="number"
            value={restTime}
            onChange={handleRestTimeChange}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="calorieGoal" className="block mb-2">
            เป้าหมายแคลอรี่:
          </Label>
          <Input
            id="calorieGoal"
            type="number"
            value={calorieGoal}
            onChange={handleCalorieGoalChange}
            className="w-full"
          />
        </div>
        <div className="text-center mb-4">
          <p>
            เซ็ตที่ทำแล้ว: {sets} / {totalSets}
          </p>
          <p>
            แคลอรี่ที่เผาผลาญ: {caloriesBurned} / {calorieGoal}
          </p>
          <p>
            เวลากระโดดทั้งหมด: {Math.floor(totalJumpTime / 60)} นาที{" "}
            {totalJumpTime % 60} วินาที
          </p>
        </div>
        <p className="text-sm text-gray-600 text-center">
          {isResting
            ? "กำลังพัก... เตรียมตัวกระโดดเชือกรอบต่อไป!"
            : "กำลังกระโดดเชือก... สู้ๆ!"}
        </p>
      </div>
    </div>
  );
}
