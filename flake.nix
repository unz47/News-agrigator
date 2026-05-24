{
  description = "Daily News Collector dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_24
            pnpm
            awscli2
            git
          ];

          shellHook = ''
            echo ""
            echo "🗞️  Daily News Collector dev環境起動"
            echo "📦 Node:  $(node --version)"
            echo "📦 pnpm:  $(pnpm --version)"
            echo "☁️  AWS:   $(aws --version 2>&1 | head -1)"
            echo ""
          '';
        };
      });
}
