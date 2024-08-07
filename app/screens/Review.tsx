import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ReviewProps = {
    review: {
        id: string;
        username: string;
        rating: number;
        comment: string;
    };
};

const Review: React.FC<ReviewProps> = ({ review }) => {
    return (
        <View style={styles.reviewContainer}>
            <Text style={styles.reviewUsername}>{review.username}</Text>
            <Text style={styles.reviewRating}>Rating: {review.rating}</Text>
            <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    reviewContainer: {
        marginVertical: 8,
    },
    reviewUsername: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewRating: {
        fontSize: 14,
        color: '#888',
    },
    reviewComment: {
        fontSize: 14,
        color: '#333',
    },
});

export default Review;