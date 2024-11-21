<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{

    public function definition()
    {
        return [
            'accountNumberFrom' => $this->faker->numerify('########'),
            'accountNumberTypeFrom' => $this->faker->randomElement(['Credit', 'Checking', 'Savings']),
            'accountNumberTo' => $this->faker->numerify('########'),
            'accountNumberTypeTo' => $this->faker->randomElement(['Credit', 'Checking', 'Savings']),
            'amount' => $this->faker->randomFloat(2, 10, 1000),
            'description' => $this->faker->sentence,
            'creationDate' => $this->faker->dateTimeThisYear(),
            'reference' => $this->faker->uuid(),
            'traceNumber' => Str::uuid()->toString()
        ];
    }
}
