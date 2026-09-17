import itertools
import unittest
from more_itertools import unique_in_window

class IndependentWindowTests(unittest.TestCase):
    def test_docs_explicitly_disambiguate_input_from_yielded(self):
        doc = unique_in_window.__doc__
        self.assertIn("haven't been yielded recently", doc)
        self.assertIn('not the last', doc)
        self.assertIn('Skipped duplicates do not advance', doc)

    def test_all_small_inputs_match_yielded_window_reference(self):
        for seq in itertools.product(range(3), repeat=6):
            for n in (1, 2, 3, 10):
                expected = []
                for item in seq:
                    if item not in expected[-n:]:
                        expected.append(item)
                self.assertEqual(list(unique_in_window(iter(seq), n)), expected)

    def test_key_objects_and_laziness(self):
        rows = [{'id': n} for n in [1, 2, 2, 2, 1, 3, 4, 1]]
        self.assertEqual(list(unique_in_window(rows, 2, key=lambda r: r['id'])), [rows[i] for i in [0, 1, 5, 6, 7]])
        def stream():
            yield 7
            raise AssertionError('eager consumption')
        self.assertEqual(next(unique_in_window(stream(), 1)), 7)

    def test_empty_and_singleton(self):
        self.assertEqual(list(unique_in_window([], 1)), [])
        self.assertEqual(list(unique_in_window([None] * 100, 1)), [None])
