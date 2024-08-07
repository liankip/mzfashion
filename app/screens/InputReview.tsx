import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

type InputReviewProps = {
    onAddReview: (review: { username: string; rating: number; comment: string }) => void;
};

const InputReview: React.FC<InputReviewProps> = ({ onAddReview }) => {
    const [username, setUsername] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleAddReview = () => {
        onAddReview({ username, rating, comment });
        setUsername('');
        setRating(0);
        setComment('');
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Rating (1-5)"
                value={String(rating)}
                onChangeText={(text) => setRating(Number(text))}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                placeholder="Comment"
                value={comment}
                onChangeText={setComment}
                style={styles.input}
            />
            <Button title="Submit Review" onPress={handleAddReview} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginVertical: 4,
    },
});

export default InputReview;
