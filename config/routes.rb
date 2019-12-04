# frozen_string_literal: true

Rails.application.routes.draw do
  root 'dashboard#index'
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    passwords: 'users/passwords',
    confirmations: 'users/confirmations'
  }
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
