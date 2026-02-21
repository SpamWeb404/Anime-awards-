'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import { Category, ElementType, elementColors } from '@/types';
import { cn } from '@/lib/utils';
import { Flame, Droplets, Moon, Sun, Leaf, Zap, Snowflake, Wind, Mountain, Sparkles } from 'lucide-react';

interface RealmViewProps {
  categories: Category[];
}

// Element icon mapping
const elementIcons: Record<ElementType, React.ElementType> = {
  fire: Flame,
  water: Droplets,
  shadow: Moon,
  light: Sun,
  nature: Leaf,
  thunder: Zap,
  ice: Snowflake,
  wind: Wind,
  earth: Mountain,
  cosmos: Sparkles,
};

// 3D Island Component
function FloatingIsland({
  position,
  color,
  scale = 1,
  children,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  children?: React.ReactNode;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <group position={position} scale={scale}>
        {/* Island base */}
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <cylinderGeometry args={[2, 1.5, 0.5, 8]} />
          <meshStandardMaterial
            color={color}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Island top */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[1.8, 2, 0.3, 8]} />
          <meshStandardMaterial
            color={new THREE.Color(color).multiplyScalar(1.2)}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Glow effect */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[2.2, 1.8, 0.2, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
          />
        </mesh>

        {children}
      </group>
    </Float>
  );
}

// 3D Scene
function RealmScene({ categories, onSelect }: { categories: Category[]; onSelect: (cat: Category) => void }) {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ec4899" />

      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />

      {/* Clouds */}
      <Cloud
        opacity={0.1}
        speed={0.4}
        width={20}
        depth={10}
        segments={20}
        color="#8b5cf6"
        position={[-10, 5, -10]}
      />
      <Cloud
        opacity={0.08}
        speed={0.3}
        width={15}
        depth={8}
        segments={15}
        color="#ec4899"
        position={[10, -3, -5]}
      />

      {/* Floating islands for categories */}
      {categories.map((category, index) => {
        const colors = elementColors[category.element];
        const angle = (index / categories.length) * Math.PI * 2;
        const radius = 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(index * 1.5) * 2;

        return (
          <FloatingIsland
            key={category.id}
            position={[x, y, z]}
            color={colors.primary}
            scale={0.8 + (category.nomineeCount || 0) * 0.02}
          >
            {/* Element symbol */}
            <mesh position={[0, 1, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial
                color={colors.glow}
                emissive={colors.primary}
                emissiveIntensity={0.5}
              />
            </mesh>
          </FloatingIsland>
        );
      })}

      {/* Connecting lines between islands */}
      {categories.map((_, index) => {
        const nextIndex = (index + 1) % categories.length;
        const angle1 = (index / categories.length) * Math.PI * 2;
        const angle2 = (nextIndex / categories.length) * Math.PI * 2;
        const radius = 8;

        const start = new THREE.Vector3(
          Math.cos(angle1) * radius,
          Math.sin(index * 1.5) * 2,
          Math.sin(angle1) * radius
        );
        const end = new THREE.Vector3(
          Math.cos(angle2) * radius,
          Math.sin(nextIndex * 1.5) * 2,
          Math.sin(angle2) * radius
        );

        return (
          <line key={`line-${index}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...start.toArray(), ...end.toArray()])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#8b5cf6" opacity={0.3} transparent />
          </line>
        );
      })}
    </>
  );
}

// 2D Category Card (fallback/mobile)
function CategoryCard({
  category,
  index,
  onClick,
}: {
  category: Category;
  index: number;
  onClick: () => void;
}) {
  const colors = elementColors[category.element];
  const Icon = elementIcons[category.element];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative p-6 rounded-2xl cursor-pointer overflow-hidden',
        'border transition-all duration-300',
        'group'
      )}
      style={{
        borderColor: `${colors.primary}40`,
        background: `linear-gradient(135deg, ${colors.primary}10, transparent)`,
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${colors.glow}, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}20)`,
            boxShadow: `0 0 20px ${colors.glow}`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: colors.primary }} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>

        {/* Description */}
        {category.description && (
          <p className="text-sm text-slate-400 mb-3 line-clamp-2">
            {category.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-500">
            {category.nomineeCount} nominees
          </span>
          {category.userVoted && (
            <span
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                background: `${colors.primary}30`,
                color: colors.primary,
              }}
            >
              Voted
            </span>
          )}
        </div>
      </div>

      {/* Decorative corner */}
      <div
        className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-20"
        style={{ background: colors.primary }}
      />
    </motion.div>
  );
}

export function RealmView({ categories }: RealmViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [is3DEnabled, setIs3DEnabled] = useState(true);

  const handleCategorySelect = useCallback((category: Category) => {
    setSelectedCategory(category);
    // Trigger Chibi-sama dialogue
    window.dispatchEvent(
      new CustomEvent('chibisama:speak', {
        detail: {
          category: 'categories',
          subcategory: category.element,
          replacements: { categoryName: category.name },
        },
      })
    );
  }, []);

  // Check if device supports WebGL well
  const supports3D = useMemo(() => {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-200px)]">
      {/* View toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setIs3DEnabled(!is3DEnabled)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm transition-colors',
            is3DEnabled
              ? 'bg-violet-600 text-white'
              : 'bg-slate-800 text-slate-400'
          )}
        >
          {is3DEnabled ? '3D View' : '2D View'}
        </button>
      </div>

      {/* 3D View */}
      {is3DEnabled && supports3D && (
        <div className="h-[600px] w-full">
          <Canvas
            camera={{ position: [0, 5, 15], fov: 60 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <RealmScene
              categories={categories}
              onSelect={handleCategorySelect}
            />
          </Canvas>
        </div>
      )}

      {/* 2D Grid View (fallback or toggle) */}
      {(!is3DEnabled || !supports3D) && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold gradient-text mb-4">
              The Floating Realms
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Each island represents a category. Click to explore and bind your
              soul to your favorite nominees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                onClick={() => handleCategorySelect(category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category detail modal */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedCategory(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-strong rounded-2xl p-8 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedCategory.name}
            </h2>
            <p className="text-slate-400 mb-6">
              {selectedCategory.description}
            </p>
            <div className="flex gap-4">
              <a
                href={`/category/${selectedCategory.id}`}
                className="flex-1 px-6 py-3 rounded-lg bg-violet-600 text-white text-center font-medium hover:bg-violet-700 transition-colors"
              >
                Enter Realm
              </a>
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-6 py-3 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
