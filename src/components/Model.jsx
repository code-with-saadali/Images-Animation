"use client";
import React, { useEffect, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { animate, useMotionValue, useTransform } from "framer-motion";
import { vertex, fragment } from "./Shader";
import { useTexture, useAspect } from "@react-three/drei";
import useMouse from "./useMouse";
import useDimension from "./useDimension";

export default function Model({ activeMenu }) {
  const plane = useRef();
  const { viewport } = useThree();
  const dimension = useDimension();
  const mouse = useMouse();
  const opacity = useMotionValue(0);

  const project1 = { title: "Richard Gaston", src: "/images/5.jpg" };
  const project2 = {
    title: "KangHee Kim",
    src: "/images/6.jpg",
  };
  const project3 = {
    title: "Inka and Niclas",
    src: "/images/7.jpg",
  };
  const project4 = {
    title: "Arch McLeish",
    src: "/images/2.jpg",
  };
  const project5 = {
    title: "Nadir Bucan",
    src: "/images/1.jpg",
  };
  const project6 = {
    title: "Chandler Bondurant",
    src: "/images/3.jpg",
  };
  const project7 = {
    title: "Arianna Lago",
    src: "/images/4.jpg",
  };
  const project1Tex = useTexture(project1.src);
  const project2Tex = useTexture(project2.src);
  const project3Tex = useTexture(project3.src);
  const project4Tex = useTexture(project4.src);
  const project5Tex = useTexture(project5.src);
  const project6Tex = useTexture(project6.src);
  const project7Tex = useTexture(project7.src);

  // Now use useTexture directly in the component, outside of useMemo
  const textures = useMemo(
    () => [
      project1Tex,
      project2Tex,
      project3Tex,
      project4Tex,
      project5Tex,
      project6Tex,
      project7Tex,
    ],
    [
      project1Tex,
      project2Tex,
      project3Tex,
      project4Tex,
      project5Tex,
      project6Tex,
      project7Tex,
    ]
  ); // Fallback in case the texture is not loaded yet
  const { width, height } = textures[0]?.image || { width: 0, height: 0 };

  const lerp = (x, y, a) => x * (1 - a) + y * a;

  const scale = useAspect(width, height, 0.225);
  const smoothMouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  useEffect(() => {
    if (activeMenu != null) {
      plane.current.material.uniforms.uTexture.value = textures[activeMenu];
      animate(opacity, 1, {
        duration: 0.2,
        onUpdate: (latest) => {
          plane.current.material.uniforms.uAlpha.value = latest;
        },
      });
    } else {
      animate(opacity, 0, {
        duration: 0.2,
        onUpdate: (latest) => {
          plane.current.material.uniforms.uAlpha.value = latest;
        },
      });
    }
  }, [activeMenu, opacity, textures]);

  const uniforms = useRef({
    uDelta: { value: { x: 0, y: 0 } },
    uAmplitude: { value: 0.0005 },
    uTexture: { value: textures[0] },
    uAlpha: { value: 0 },
  });

  useFrame(() => {
    const { x, y } = mouse;
    const smoothX = smoothMouse.x.get();
    const smoothY = smoothMouse.y.get();

    if (Math.abs(x - smoothX) > 1) {
      smoothMouse.x.set(lerp(smoothX, x, 0.1));
      smoothMouse.y.set(lerp(smoothY, y, 0.1));
      plane.current.material.uniforms.uDelta.value = {
        x: x - smoothX,
        y: -1 * (y - smoothY),
      };
    }
  });

  const x = useTransform(
    smoothMouse.x,
    [0, dimension.width],
    [(-1 * viewport.width) / 2, viewport.width / 2]
  );
  const y = useTransform(
    smoothMouse.y,
    [0, dimension.height],
    [viewport.height / 2, (-1 * viewport.height) / 2]
  );

  return (
    <motion.mesh position-x={x} position-y={y} ref={plane} scale={scale}>
      <planeGeometry args={[1, 1, 15, 15]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms.current}
        transparent={true}
      />
    </motion.mesh>
  );
}
