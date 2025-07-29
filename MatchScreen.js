import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MatchScreen = ({ route, navigation }) => {
  const { movie, matches = [] } = route.params;
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation d'entrée
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Animation de pulsation pour le cœur
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleContinue = () => {
    navigation.goBack();
  };

  const handleViewMatches = () => {
    console.log('Voir tous les matches:', matches);
  };

  return (
    <LinearGradient
      colors={['#FF6B6B', '#FF8E8E']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Particules flottantes animées */}
        <View style={styles.particlesContainer}>
          {[...Array(15)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  left: Math.random() * screenWidth,
                  top: Math.random() * screenHeight,
                  opacity: Math.random() * 0.6 + 0.2,
                  transform: [{
                    translateY: Animated.multiply(
                      Animated.modulo(
                        Animated.add(
                          fadeAnim,
                          new Animated.Value(i * 0.1)
                        ),
                        1
                      ),
                      -screenHeight
                    )
                  }]
                }
              ]}
            />
          ))}
        </View>

        {/* Header avec animation */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.heartContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Ionicons name="heart" size={80} color="#FFF" />
          </Animated.View>
          <Text style={styles.matchTitle}>C'est un Match !</Text>
          <Text style={styles.matchSubtitle}>
            Vous avez tous les deux aimé ce film
          </Text>
        </Animated.View>

        {/* Movie Card avec animation */}
        <Animated.View
          style={[
            styles.movieContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.movieCard}>
            <View style={styles.posterContainer}>
              <Image
                source={{ uri: movie.poster }}
                style={styles.moviePoster}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.posterGradient}
              />
            </View>
            
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <Text style={styles.movieYear}>{movie.year}</Text>
              
              <View style={styles.movieDetails}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={20} color="#FFD700" />
                  <Text style={styles.movieRating}>{movie.rating}/10</Text>
                </View>
                
                <Text style={styles.movieGenre}>{movie.genre}</Text>
              </View>
              
              {movie.type === 'series' && movie.seasons && (
                <View style={styles.seasonContainer}>
                  <Ionicons name="tv-outline" size={16} color="#666" />
                  <Text style={styles.seasonText}>{movie.seasons}</Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{matches.length}</Text>
            <Text style={styles.statLabel}>Matches totaux</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="film-outline" size={40} color="#FFF" />
            <Text style={styles.statLabel}>Prêt à regarder</Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={[
            styles.buttonsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewMatches}
            activeOpacity={0.8}
          >
            <Ionicons name="list-outline" size={24} color="#FF6B6B" />
            <Text style={styles.secondaryButtonText}>Voir mes matches</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFF', '#F5F5F5']}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Continuer à swiper</Text>
              <Ionicons name="arrow-forward" size={20} color="#FF6B6B" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  heartContainer: {
    marginBottom: 20,
  },
  matchTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  matchSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  movieContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  movieCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    width: '100%',
    maxWidth: 350,
  },
  posterContainer: {
    height: 200,
    position: 'relative',
  },
  moviePoster: {
    width: '100%',
    height: '100%',
  },
  posterGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  movieInfo: {
    padding: 20,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  movieYear: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  movieDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movieRating: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 5,
  },
  movieGenre: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  seasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
  seasonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 15,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    gap: 10,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    gap: 10,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B',
  },
});

export default MatchScreen;